const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://techcrunch.com/category/artificial-intelligence/';

async function fetchData() {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('Error fetching data:', error);
  }
}

function parseHTML(html) {
  const $ = cheerio.load(html);

  const articles = [];
  $('.post-block').each((index, element) => {
    const title = $(element).find('.post-block__title__link').text().trim();
    const description = $(element).find('.post-block__content').text().trim();
    const imageUrl = $(element).find('img').attr('src');
    const link = $(element).find('.post-block__title__link').attr('href');

    articles.push({
      title,
      description,
      imageUrl,
      link,
    });
  });

  return articles;
}

async function main() {
  const htmlData = await fetchData();
  const extractedArticles = parseHTML(htmlData);

  // Convert articles array to JSON
  const jsonData = JSON.stringify(extractedArticles, null, 2);

  // Write the JSON data to a file
  fs.writeFile('techcrunch_articles.json', jsonData, (err) => {
    if (err) {
      console.log('Error writing to file:', err);
    } else {
      console.log('Articles saved to techcrunch_articles.json');
    }
  });
}

main();