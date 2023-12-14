import { PrismaClient, Prisma } from '@prisma/client';
import { Article } from './types';

const prisma = new PrismaClient();

async function saveToDatabase(extractedArticles: Article[]) {
  try {
    for (const item of extractedArticles) {
      const existingArticle = await prisma.news.findFirst({
        where: {
          title: item.title,
          link: item.link,
        },
      });

      if (!existingArticle) {
        await prisma.news.create({
          data: {
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            link: item.link,
            source: item.source,
            tags: item.tags,
            category: item.category ?? '',
            type: item.type ?? '',
          },
        });
      } else {
        console.log(`Duplicate article found: ${item.title} - ${item.link}`);
      }
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        console.error('Unique constraint violation:', error);
      } else {
        console.log('Error saving data to the database:', error);
      }
    }
  }
}

export default saveToDatabase;
