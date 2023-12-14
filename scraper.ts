import axios from 'axios';
import cheerio from 'cheerio';
import readWebsiteConfigs from './config.ts';
import { mapParamToCategory } from './utils.ts';
import { ParamType, WebsiteConfig, Article } from './types.ts';


async function fetchData(url: string): Promise<string | null> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(`Error fetching data for ${url}:`, error);
      return null;
    }
  }

  function parseHTML(html: string, config: WebsiteConfig, param?: ParamType): Article[] {
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
  
        let category = 'General'; // Default category
        let type = 'General';     // Default type
        if (config.params && param) {
          const categoryType = mapParamToCategory(param);
          category = categoryType.category;
          type = categoryType.type;
        }
  
      articles.push({
        title,
        description,
        imageUrl,
        link: link ?? '',
        source,
        tags,
        category,
        type
      });
    });
  
    return articles;
  }

  async function scrapeUrlsForConfig(config: WebsiteConfig, param?: ParamType): Promise<Article[]> {
    const htmlData = param ? await fetchData(config.url + param) : await fetchData(config.url);
  
    if (htmlData) {
      return parseHTML(htmlData, config, param);
    }
  
    return [];
  }

  async function scrapeAllUrls(): Promise<Article[]> {
    const allArticles: Article[] = [];
    const urlConfigs = await readWebsiteConfigs();
  
    for (const config of urlConfigs) {
      if (config.params) {
        const paramsArray = config.params;
        const promises = paramsArray.map(async (param) => {
          return await scrapeUrlsForConfig(config, param as ParamType);
        });
  
        const extractedArticlesArray = await Promise.all(promises);
        const extractedArticles = extractedArticlesArray.flat();
        allArticles.push(...extractedArticles);
      } else {
        const extractedArticles = await scrapeUrlsForConfig(config);
        allArticles.push(...extractedArticles);
      }
    }
  
    const uniqueArticles = Array.from(new Map(allArticles.map((article) => [article.title + article.link, article])).values());
    return uniqueArticles;
  }





export default scrapeAllUrls;
