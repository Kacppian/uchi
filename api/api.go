package main

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

// HealthResponse stores the verison and name of the service
type HealthResponse struct {
	Version string `json:"version"`
	Name    string `json:"name"`
}

func index(w http.ResponseWriter, r *http.Request) {
	health := HealthResponse{
		Version: "0.1.0",
		Name:    "uchi-api"}
	json.NewEncoder(w).Encode(health)
}

func main() {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", index)
	http.ListenAndServe(":3001", router)
}
