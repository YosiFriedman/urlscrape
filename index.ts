import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs/promises';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
interface WebsiteConfig {
  url: string;
  articleSelector: string;
  titleSelector: string;
  descriptionSelector: string;
  imageSelector: string;
  linkSelector: string;
  tags: string;
  source: string;
  params?: string[]; // Optional parameters for the URL
}

interface Article {
  title: string;
  description?: string;
  imageUrl?: string;
  link: string;
  source: string;
  tags?: string[];
}

async function readWebsiteConfigs(): Promise<WebsiteConfig[]> {
  try {
    const data = await fs.readFile('websiteConfigs.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading websiteConfigs.json:', error);
    return [];
  }
}

async function fetchData(url: string): Promise<string | null> {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(`Error fetching data for ${url}:`, error);
    return null;
  }
}

function parseHTML(html: string, config: WebsiteConfig): Article[] {
  const $ = cheerio.load(html);

  let articles: Article[] = [];
  $(config.articleSelector).each((index, element) => {
    const title = $(element).find(config.titleSelector).text().trim();
    const description = $(element).find(config.descriptionSelector).text().trim();
    const imageUrl = $(element).find(config.imageSelector).attr('src');
    const link = $(element).find(config.linkSelector).attr('href');
    const tagsBlock = $(element).find(config.tags);
    const source = config.source;
    const tags = tagsBlock
      .map(function () {
        return $(this).text().trim();
      })
      .get()
      .join(' ,')
      .split(' ,');

    articles.push({
      title,
      description,
      imageUrl,
      link: link ?? '',
      source,
      tags
    });
  });

  return articles;
}

async function scrapeUrls(): Promise<Article[]> {
  const allArticles: Article[] = [];
  const urlConfigs = await readWebsiteConfigs();

  for (const config of urlConfigs) {
    if (config.params) {
      const paramsArray = config.params;
      const promises = paramsArray.map(async (param) => {
        const htmlData = await fetchData(config.url + param);
        if (htmlData) {
          const extractedArticles = parseHTML(htmlData, config);
          return extractedArticles;
        }
        return [];
      });

      const extractedArticlesArray = await Promise.all(promises);
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
  const uniqueArticles = Array.from(new Map(allArticles.map((article) => [article.title + article.link, article])).values());
  return uniqueArticles;
}

// async function main() {
//   const extractedArticles = await scrapeUrls();

//   // Convert articles array to JSON
//   const jsonData = JSON.stringify(extractedArticles, null, 2);

//   // Write the JSON data to a file
//   try {
//     await fs.writeFile('articles_data.json', jsonData);
//     console.log('Articles saved to articles_data.json');
//   } catch (err) {
//     console.log('Error writing to file:', err);
//   }
// }

async function saveToDatabase() {
  const extractedArticles = await scrapeUrls();
  try {
    for (const item of extractedArticles) {
      await prisma.article.create({
        data: {
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          link: item.link,
          source: item.source,
          tags: item.tags,
        },
      });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        console.error('Unique constraint violation:', error);
      } else {
        console.log(error)
      }
    }
  }
}

saveToDatabase()
  .then(() => {
    console.log('Data saved to the database.');
  })
  .catch((error) => {
    console.error('Error saving data to the database:', error);
  });
// main();
