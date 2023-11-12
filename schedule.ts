import cron from 'node-cron';
import scrapeUrls from './index';

// Schedule the scraping task to run every 24 hours
cron.schedule('0 0 */24 * * *', () => {
  console.log('Running the scraping task...');
  scrapeUrls().then(() => {
    console.log('Scraping task completed.');
  }).catch((error) => {
    console.error('Error running scraping task:', error);
  });
});