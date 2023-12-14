export type ParamType = 'javascript' | 'tech' | 'technology' | 'programming' | 'web-development' | 'react' | 'python' | 'startup' | 'software-development' | 'css' | '?type=popular' | '?type=recent' | 'reactjs' | 'html' | 'nodejs' | 'node-js' | 'webdev' | 'beginners' | 'typescript' | 'news' | 'ai' | 'productivity' | 'career-advice' | 'open-source';
export type CategoryTypeInfo = {
  category: string;
  type: string;
};

export interface WebsiteConfig {
    url: string;
    articleSelector: string;
    titleSelector: string;
    descriptionSelector: string;
    imageSelector: string;
    linkSelector: string;
    tags: string;
    source: string;
    params?: string[];
    categorySelector?: string;
  }
  
export interface Article {
    title: string;
    description?: string;
    imageUrl?: string;
    link: string;
    source: string;
    tags?: string[];
    category?: string;
    type?: string;
  }