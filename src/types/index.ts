// src/types/index.ts

export interface UserData {
    name: string;
    login: string;
    avatar_url: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    html_url: string;
  }
  
  export interface Repository {
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
  
  export interface CommitData {
    date: string;
    count: number;
  }