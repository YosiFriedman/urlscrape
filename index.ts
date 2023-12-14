import scrapeAllUrls from './scraper.ts';
import saveToDatabase from './database.ts';

async function main() {
  try {
    const extractedArticles = await scrapeAllUrls();
    await saveToDatabase(extractedArticles);
    console.log('Data saved to the database.');
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

main();
