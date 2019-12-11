import scrapy

class NobrokerScraper(scrapy.Spider):
    name = 'nobroker_scraper'
    start_urls = ['https://www.nobroker.in/property/rent/bangalore/Bangalore/?searchParam=W3sibGF0IjoxMi45Njk5MzM0NDAzNjgxLCJsb24iOjc3LjU5ODE3NzAzMjg1MjIsInNob3dNYXAiOmZhbHNlLCJwbGFjZUlkIjoiQ2hJSmJVNjB5WEFXcmpzUjRFOS1VZWpEM19nIiwicGxhY2VOYW1lIjoiQmFuZ2Fsb3JlIiwiY2l0eSI6ImJhbmdhbG9yZSJ9XQ==&sharedAccomodation=0&orderBy=nbRank,desc&radius=2&traffic=true&travelTime=30&propertyType=rent&pageNo=1']

    def extract_coords(self, span_element):
        lat = span_element.xpath("meta[@itemprop = 'latitude']/@content").get()
        lng = span_element.xpath("meta[@itemprop = 'longitude']/@content").get()
        return { 'lat': lat, 'lng': lng }

    def extract_area(self, parent_div):
        spans = parent_div.css('h3 span')
        area = spans[0].root.text.replace(",", "")
        unit_type = spans[1].root.text.strip()
        return { "value": area, "unit_type": unit_type }

    def extract_deposit(self, parent_div):
        deposit_amount = parent_div.css('meta[itemprop = "value"]')[0].xpath("@content").get()
        return deposit_amount.replace(",", "")
    
    def extract_rent(self, parent_div):
        rent_amount = parent_div.css('meta[itemprop = "value"]')[0].xpath("@content").get()
        return rent_amount.replace(",", "")

    def extract_images(self, meta_tags):
        return [ mt.xpath("@content").get() for mt in meta_tags ]

    def extract_additional_attributes(self, h5s):
        furnishing = h5s[0].root.text
        age = h5s[1].root.text
        preferred_tenant = h5s[2].root.text
        move_in_date = h5s[3].root.text
        return { 'furnishing': furnishing, 'age': age, 'preferred_tenant': preferred_tenant, 'move_in_date': move_in_date }

    def parse(self, response):
        results = response.xpath('//div[contains(@id, "prop-")]')

        failed = []

        for r in results:

            try:
                prop = {}
                
                geo_span = r.xpath("span[@itemprop = 'geo']")
                overview = r.css(".overview > div")
                image_metas = r.css('.nobrokerSlider > meta[itemprop = "value"]')
                h5s = r.css(".detail-summary h5")

                prop['coordinates'] = self.extract_coords(geo_span)
                prop['title'] = r.css(".card-link-detail")[0].xpath('@title').get()
                prop['link_to'] = r.css(".card-link-detail")[0].xpath('@href').get()
                prop['area'] = self.extract_area(overview[0])
                prop['deposit'] = self.extract_deposit(overview[1])
                prop['rent'] = self.extract_rent(overview[2])
                prop['images'] = self.extract_images(image_metas)
                prop['additional_attributes'] = self.extract_additional_attributes(h5s)

                print("property")
                print(prop)
                yield prop                
            except Exception as e:
                failed.append(r.extract())
        
        with open(f"errors.txt", "a") as f:
            for e in failed:
                f.write(e)

        if len(results):
            url, page_no = response.url.split("pageNo=")
            next_page_no = int(page_no) + 1
            next_page = f"{url}pageNo={next_page_no}"
            yield scrapy.Request(next_page, callback=self.parse)


