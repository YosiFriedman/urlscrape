const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');


async function readWebsiteConfigs() {
  try {
    const data = await fs.promises.readFile('websiteConfigs.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading websiteConfigs.json:', error);
    return [];
  }
}

async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(`Error fetching data for ${url}:`, error);
    return null;
  }
}

function parseHTML(html, config) {
  const $ = cheerio.load(html);

  let articles = [];
  $(config.articleSelector).each((index, element) => {
    const title = $(element).find(config.titleSelector).text().trim();
    const description = $(element).find(config.descriptionSelector).text().trim();
    const imageUrl = $(element).find(config.imageSelector).attr('src');
    const link = $(element).find(config.linkSelector).attr('href');
    const tagsBlock = $(element).find(config.tags);
    const source = config.source
    const tags= tagsBlock.map(function() {
      return $(this).text().trim();
    }).get().join(' ,');

    
    articles.push({
      title,
      description,
      imageUrl,
      link,
      source,
      tags
    });
  });

  return articles;
}

async function scrapeUrls() {
  const allArticles = [];
  const urlConfigs = await readWebsiteConfigs();

  for (const config of urlConfigs) {
    if (config.params) {
      const paramsArray = config.params; // Corrected the variable name
      const promises = paramsArray.map(async (param) => {
        const htmlData = await fetchData(config.url + param);
        if (htmlData) {
          const extractedArticles = parseHTML(htmlData, config);
          return extractedArticles; // Return the extracted articles as a result of the map
        }
        return []; // Return an empty array if there's no htmlData
      });

      const extractedArticlesArray = await Promise.all(promises);
      // Flatten the array of arrays into a single array
      const extractedArticles = extractedArticlesArray.flat();
      allArticles.push(...extractedArticles);
    } else {
      const htmlData = await fetchData(config.url);
      if (htmlData) {
        const extractedArticles = parseHTML(htmlData, config);
        allArticles.push(...extractedArticles);
      }
    }
  }

  return allArticles;
}


async function main() {
  const extractedArticles = await scrapeUrls();

  // Convert articles array to JSON
  const jsonData = JSON.stringify(extractedArticles, null, 2);

  // Write the JSON data to a file
  fs.writeFile('articles_data.json', jsonData, (err) => {
    if (err) {
      console.log('Error writing to file:', err);
    } else {
      console.log('Articles saved to articles_data.json');
    }
  });
}

main();
