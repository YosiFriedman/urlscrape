import fs from 'fs/promises';
import { WebsiteConfig } from './types';

    async function readWebsiteConfigs(): Promise<WebsiteConfig[]> {
        try {
          const data = await fs.readFile('websiteConfigs.json', 'utf-8');
          return JSON.parse(data);
        } catch (error) {
          console.error('Error reading websiteConfigs.json:', error);
          return [];
        }
      }

export default readWebsiteConfigs;