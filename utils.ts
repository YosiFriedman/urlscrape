import { ParamType, CategoryTypeInfo } from './types.ts';

export function mapParamToCategory(param: ParamType): CategoryTypeInfo {
        const categoryMapping: { [key in ParamType]: CategoryTypeInfo } = {
          'javascript': { category: 'JavaScript', type: 'Programming Language' },
          'tech': { category: 'Technology', type: 'General Tech' },
          'technology': { category: 'Technology', type: 'General Tech' },
          'programming': { category: 'Programming', type: 'General Tech' },
          'web-development': { category: 'Web Development', type: 'Programming Language' },
          'react': { category: 'React', type: 'Framework/Library' },
          'python': { category: 'Python', type: 'Programming Language' },
          'startup': { category: 'Startups', type: 'Business' },
          'software-development': { category: 'Software Development', type: 'General Tech' },
          'css': { category: 'CSS', type: 'Programming Language' },
          '?type=popular': { category: 'Popular Tech', type: 'Trending' },
          '?type=recent': { category: 'Recent Tech', type: 'Latest Updates' },
          'reactjs': { category: 'React', type: 'Framework/Library' },
          'html': { category: 'HTML', type: 'Programming Language' },
          'nodejs': { category: 'Node.js', type: 'Programming Language' },
          'node-js': { category: 'Node.js', type: 'Programming Language' },
          'webdev': { category: 'Web Development', type: 'Development' },
          'beginners': { category: 'Beginner Programming', type: 'Educational' },
          'typescript': { category: 'TypeScript', type: 'Programming Language' },
          'news': { category: 'Tech News', type: 'News' },
          'ai': { category: 'Artificial Intelligence', type: 'Technology' },
          'productivity': { category: 'Productivity', type: 'Skill Development' },
          'career-advice': { category: 'Career Advice', type: 'Professional Development' },
          'open-source': { category: 'Open Source', type: 'Development Model' },
        };
      
        return categoryMapping[param] || { category: 'General', type: 'General' };
      }