# GitHub User Profile Analyzer

This application takes a GitHub username as input and displays the user's public repositories along with an interactive daily commit activity chart using a line chart. It uses the open GitHub API (with its default rate limits) and does not require a personal GitHub token.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/github-user-profile-analyzer.git
   cd github-user-profile-analyzer
   ```

2. **Install Dependencies:**

   Ensure you have Node.js installed, then run:

   ```bash
   npm install
   ```

3. **Run the Development Server:**

   ```bash
   npm run dev
   ```

   This starts the app on http://localhost:3000 (or another port specified by Vite).

## Deploying on Vercel

1. **Sign Up / Log In to Vercel:**

   Go to Vercel and sign up or log in.

2. **Install Vercel CLI (Optional):**

   You can deploy via the Vercel CLI by installing it globally:

   ```bash
   npm install -g vercel
   ```

3. **Deploy the Application:**

   In the project's root directory, run:

   ```bash
   vercel
   ```

   Follow the interactive prompts to deploy your app. Alternatively, you can connect your repository to Vercel via their dashboard for continuous deployments on push.
