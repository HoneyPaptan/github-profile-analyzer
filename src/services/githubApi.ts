// Types
interface UserData {
  name: string;
  login: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  created_at: string;
}

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

interface CommitData {
  date: string;
  count: number;
}

// Base GitHub API URL
const GITHUB_API_URL = 'https://api.github.com';


const getFetchOptions = () => ({
  headers: {
    
  },
});


export const fetchUserCommitsByYear = async (
  username: string,
  year: number
): Promise<CommitData[]> => {
  try {
    // Get the user's repositories
    const repos = await fetchUserRepos(username);
    // Take the first 5 repos to avoid hitting rate limits
    const reposToFetch = repos.slice(0, 5);

    // Set date range for the selected year
    const startDate = new Date(year, 0, 1); 
    const endDate = new Date(year, 11, 31); 
    
    if (year === new Date().getFullYear()) {
      endDate.setTime(new Date().getTime());
    }

   
    const commitsByDay: Record<string, number> = {};
 
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      commitsByDay[dateStr] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }


    const commitsPromises = reposToFetch.map(async (repo) => {
      const repoName = repo.name;
      const since = startDate.toISOString();
      const until = endDate.toISOString();

      try {
        const commitResponse = await fetch(
          `${GITHUB_API_URL}/repos/${username}/${repoName}/commits?author=${username}&since=${since}&until=${until}&per_page=100`,
          getFetchOptions()
        );

        if (!commitResponse.ok) {
          console.error(
            `Failed to fetch commits for ${repoName}: ${commitResponse.statusText}`
          );
          return [];
        }

        const commits = await commitResponse.json();

        // Count commits by day
        commits.forEach((commit: any) => {
          const date = commit.commit.author.date.split("T")[0];
          if (commitsByDay[date] !== undefined) {
            commitsByDay[date]++;
          }
        });
      } catch (err) {
        console.error(`Error processing commits for ${repoName}:`, err);
      }
    });

    // Wait for all commit fetching to complete
    await Promise.all(commitsPromises);


    const formattedData = Object.entries(commitsByDay)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return formattedData;
  } catch (error) {
    console.error("Error fetching commit activity by year:", error);
    return [];
  }
};

/**
 * Get a user's GitHub account creation year
 * This helps determine the earliest year to show in the selector
 */
export const getUserCreationYear = async (username: string): Promise<number> => {
  try {
    const userData = await fetchUserData(username);
    const createdAt = new Date(userData.created_at);
    return createdAt.getFullYear();
  } catch (error) {
    console.error("Error getting user creation year:", error);
    return new Date().getFullYear() - 5; 
  }
};

/**
 * Fetch a GitHub user's profile data
 */
export const fetchUserData = async (username: string): Promise<UserData> => {
  const response = await fetch(
    `${GITHUB_API_URL}/users/${username}`,
    getFetchOptions()
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Fetch a GitHub user's repositories
 */
export const fetchUserRepos = async (username: string): Promise<Repository[]> => {
  // Get repositories sorted by last updated
  const response = await fetch(
    `${GITHUB_API_URL}/users/${username}/repos?sort=updated&per_page=100`,
    getFetchOptions()
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch repositories: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Fetch commit activity data for a user
 * Note: Due to GitHub API limitations, we can't easily get all commits across all repositories.
 * This is a simplified version that gets commit activity for the user's first 5 repositories.
 */
export const fetchUserCommits = async (username: string): Promise<CommitData[]> => {
  try {
 
    const repos = await fetchUserRepos(username);
    const reposToFetch = repos.slice(0, 5);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const commitsByDay: Record<string, number> = {};
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      commitsByDay[dateStr] = 0;
    }

    // For each repository, fetch commits stats
    const commitsPromises = reposToFetch.map(async (repo) => {
      const repoName = repo.name;
      const since = startDate.toISOString();
      const until = endDate.toISOString();

      try {
        const commitResponse = await fetch(
          `${GITHUB_API_URL}/repos/${username}/${repoName}/commits?author=${username}&since=${since}&until=${until}&per_page=100`,
          getFetchOptions()
        );

        if (!commitResponse.ok) {
          console.error(
            `Failed to fetch commits for ${repoName}: ${commitResponse.statusText}`
          );
          return [];
        }

        const commits = await commitResponse.json();

        // Count commits by day
        commits.forEach((commit: any) => {
          const date = commit.commit.author.date.split("T")[0];
          if (commitsByDay[date] !== undefined) {
            commitsByDay[date]++;
          }
        });
      } catch (err) {
        console.error(`Error processing commits for ${repoName}:`, err);
      }
    });
    await Promise.all(commitsPromises);

    // Convert the commitsByDay object to an array format for the chart
    const formattedData = Object.entries(commitsByDay)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return formattedData;
  } catch (error) {
    console.error("Error fetching commit activity:", error);
    return [];
  }
};
