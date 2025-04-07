import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitFork, Star, Eye, Calendar, Code } from 'lucide-react';

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string;
  created_at: string;
  updated_at: string;
}

interface RepositoryListProps {
  repositories: Repository[];
}

export const RepositoryList: React.FC<RepositoryListProps> = ({ repositories }) => {
  // Helper to format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

 

  if (repositories.length === 0) {
    return <div className="text-center py-12">No repositories found</div>;
  }

  return (
    <div className="space-y-4">
      {repositories.map((repo) => (
        <Card key={repo.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg hover:text-blue-500">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                </CardTitle>
                <CardDescription className="mt-1">
                  {repo.description || 'No description available'}
                </CardDescription>
              </div>
              {repo.language && (
                <Badge variant="secondary" className="ml-2">
                  <Code className="h-3 w-3 mr-1" />
                  {repo.language}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                {repo.stargazers_count}
              </div>
              <div className="flex items-center">
                <GitFork className="h-4 w-4 mr-1" />
                {repo.forks_count}
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {repo.watchers_count}
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-gray-500 pt-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Created: {formatDate(repo.created_at)}
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Updated: {formatDate(repo.updated_at)}
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};