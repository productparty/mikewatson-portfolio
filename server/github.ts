import { type InsertGithubUpdate } from "@shared/schema";

const GITHUB_API_BASE = "https://api.github.com";

export async function fetchGithubUpdates(username: string): Promise<InsertGithubUpdate[]> {
  try {
    const url = `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&direction=desc`;
    const token = process.env.GITHUB_TOKEN;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": `Bearer ${token}`,
        "User-Agent": "ProductPartyPortfolio"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      console.error('Error response:', errorText);
      throw new Error(`GitHub API error: ${response.status} - ${response.statusText} - ${errorText}`);
    }

    const repos = await response.json();
    return repos.map((repo: any) => ({
      repoName: repo.name,
      description: repo.description || null,
      stars: repo.stargazers_count.toString(),
      lastUpdated: new Date(repo.updated_at),
      language: repo.language || null,
      url: repo.html_url,
    }));
  } catch (error) {
    console.error("Error fetching GitHub updates:", error);
    throw error;
  }
}