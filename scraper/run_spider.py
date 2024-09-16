from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from apscheduler.schedulers.blocking import BlockingScheduler

def run_spider():
    process = CrawlerProcess(get_project_settings())
    process.crawl('oracle_alerts')  # Name of the spider
    process.start()

if __name__ == '__main__':
    scheduler = BlockingScheduler()

    # Schedule the spider to run every 10 minutes
    scheduler.add_job(run_spider, 'interval', minutes=10)

    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        pass
