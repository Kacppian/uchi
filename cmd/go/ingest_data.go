package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"strconv"
	"strings"

	"github.com/lib/pq"
	_ "github.com/lib/pq"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "postgres"
	dbname   = "uchi-dev"
)

// Coordinates struct has lat and long
type Coordinates struct {
	Lat  string `json:"lat"`
	Long string `json:"lng"`
}

// Area struct has value and units
type Area struct {
	Value string `json:"value"`
	Units string `json:"unit_type"`
}

// AdditionalAttributes has furnishing, age, preferred tenants, and move in date of the property
type AdditionalAttributes struct {
	Furnishing       string `json:"furnishing"`
	Age              string `json:"age"`
	PreferredTenants string `json:"preferred_tenant"`
	MoveInDate       string `json:"move_in_date"`
}

// Property has title, coordinates, link to original post, area, deposit, rent, i
// mages of the property, and additional attributes
type Property struct {
	Title                string               `json:"title"`
	Coordinates          Coordinates          `json:"coordinates"`
	LinkTo               string               `json:"link_to"`
	Area                 Area                 `json:"area"`
	Deposit              string               `json:"deposit"`
	Rent                 string               `json:"rent"`
	Images               []string             `json:"images"`
	AdditionalAttributes AdditionalAttributes `json:"additional_attributes"`
}

// Properties is a list of property instances
type Properties []Property

func unmarshallJSON(jsonFilename string) Properties {
	var properties Properties
	data, err := ioutil.ReadFile(jsonFilename)
	if err != nil {
		panic(err)
	}
	json.Unmarshal([]byte(data), &properties)
	return properties
}

func main() {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)
	fmt.Println(psqlInfo)
	fmt.Println("connecting to uchi-dev....")

	db, err := sql.Open("postgres", psqlInfo)

	if err != nil {
		panic(err)
	}

	defer db.Close()

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("successfully connected")

	unmarshalledProperties := unmarshallJSON("properties.json")

	for i, r := range unmarshalledProperties {
		integerRent := 0
		integerDeposit := 0

		fmt.Println("Processing ", i)

		if r.Rent != "" {
			integerRent, err = strconv.Atoi(r.Rent)

			if err != nil {
				fmt.Println(r.Rent)
			}
		}

		if r.Deposit != "" {
			integerDeposit, err = strconv.Atoi(r.Deposit)

			if err != nil {
				fmt.Println(r.Deposit)
			}
		}

		sqlStatement := `
		INSERT INTO properties (title, lat, lng, rent, deposit, link_to, furnishing, age, preferred_tenants, move_in_date, images)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`

		trimmedTitle := strings.TrimSpace(r.Title)
		trimmedFurnishing := strings.TrimSpace(r.AdditionalAttributes.Furnishing)
		trimmedAge := strings.TrimSpace(r.AdditionalAttributes.Age)
		trimmedTenantPreference := strings.TrimSpace(r.AdditionalAttributes.PreferredTenants)
		trimmedMoveInDate := strings.TrimSpace(r.AdditionalAttributes.MoveInDate)

		_, err = db.Exec(sqlStatement, trimmedTitle, r.Coordinates.Lat, r.Coordinates.Long,
			integerRent, integerDeposit, r.LinkTo, trimmedFurnishing, trimmedAge,
			trimmedTenantPreference, trimmedMoveInDate, pq.Array(r.Images))

		if err != nil {
			fmt.Println("there's an error")
			fmt.Println(err)
			fmt.Println(i)
		}
	}
}
