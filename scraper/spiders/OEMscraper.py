import scrapy

class OracleAlertsSpider(scrapy.Spider):
    name = "oracle_alerts"
    allowed_domains = ["oracle.com"]
    start_urls = ['https://www.oracle.com/security-alerts/']

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0'
            })

    def parse(self, response):
        # Log the response body for debugging
        self.logger.info("Response body:\n%s", response.text)
        
        # Extract rows from the table using CSS selectors
        rows = response.css('div.otable-tech .otable-w1 table tbody tr')

        for row in rows[1:]:  # Skip the header row
            alert_title = row.css('td:first-child a::text').get(default='').strip()
            date = row.css('td:last-child::text').get(default='').strip()
            link = row.css('td:first-child a::attr(href)').get()

            if link:
                # Full URL for the alert page
                alert_page_url = response.urljoin(link)

                # Initial data (link, title, date)
                alert_data = {
                    'Alert Title': alert_title,
                    'Date': date,
                    'Link': alert_page_url
                }

                # Pass the data to the next request for extracting more information
                yield scrapy.Request(url=alert_page_url, callback=self.parse_alert_page, meta={'alert_data': alert_data})

    def parse_alert_page(self, response):
    # Retrieve the alert data passed from the previous request
     alert_data = response.meta['alert_data']

    # Extract description from the alert page
     paragraphs = response.css('section.cpad div.cc02w1 p')
     description_parts = []

     for paragraph in paragraphs:
        # Extract text from <p> tag
        paragraph_text = paragraph.css('::text').getall()
        # Extract text from <span> tags inside the <p> tag
        span_texts = paragraph.css('span::text').getall()
        # Combine both texts
        description_parts.extend(paragraph_text + span_texts)

    # Join all parts to form the complete description
     description = ' '.join(description_parts).strip() if description_parts else "No description available."

    # Add description to the alert data
     alert_data['Description'] = description

    # Save or yield the complete alert data
     yield alert_data
