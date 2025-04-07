import React, { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Alert, AlertDescription, AlertTitle
} from '@/components/ui/alert';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { RepositoryList } from './RepositoryList';
import { CommitsChart } from './CommitsChart';
import {
  fetchUserData, fetchUserRepos, fetchUserCommits
} from '../services/githubApi';
import { UserData, Repository, CommitData } from '../types';

const GithubProfileAnalyzer: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [commits, setCommits] = useState<CommitData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError(null);
    setUserData(null);
    setRepositories([]);
    setCommits([]);

    try {
      const userData = await fetchUserData(username);
      setUserData(userData);

      const repos = await fetchUserRepos(username);
      setRepositories(repos);

      const commitData = await fetchUserCommits(username);
      setCommits(commitData);
    } catch (err) {
      setError(`Error fetching data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader className="px-2 sm:px-4">
          <CardTitle>GitHub User Profile Analyzer</CardTitle>
          <CardDescription>
            Enter a GitHub username to see their repositories and activity
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Enter GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {userData && (
        <>
          <Card className="mb-6">
            <CardHeader className="flex flex-col sm:flex-row items-center gap-4 px-2 sm:px-4">
              <img
                src={userData.avatar_url}
                alt={`${userData.login}'s avatar`}
                className="rounded-full w-16 h-16"
              />
              <div>
                <CardTitle>{userData.name || userData.login}</CardTitle>
                <CardDescription>{userData.bio || 'No bio available'}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{userData.public_repos}</div>
                  <div className="text-sm text-gray-500">Repositories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userData.followers}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userData.following}</div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(userData.html_url, '_blank')}
              >
                View on GitHub
              </Button>
            </CardContent>
          </Card>

          <Tabs defaultValue="repositories" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="repositories">Repositories</TabsTrigger>
              <TabsTrigger value="activity">Commit Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="repositories">
              <Card>
                <CardHeader className="px-2 sm:px-4">
                  <CardTitle>Repositories</CardTitle>
                  <CardDescription>
                    {repositories.length} public repositories found
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2 sm:px-4">
                  <RepositoryList repositories={repositories} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="activity">
              <Card>
                <CardHeader className="px-2 sm:px-4">
                  <CardTitle>Commit Activity</CardTitle>
                  <CardDescription>View commit history by year</CardDescription>
                </CardHeader>
                <CardContent className="px-2 sm:px-4">
                  <div className="w-full h-full">
                    <CommitsChart username={username} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default GithubProfileAnalyzer;
