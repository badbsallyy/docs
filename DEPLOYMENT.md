# Deployment Instructions

## How to Deploy the HTML File Directory to GitHub Pages

The repository is now configured to automatically deploy the HTML file directory to GitHub Pages. Follow these steps:

### 1. Enable GitHub Pages

To enable GitHub Pages for this repository:

1. Go to your repository on GitHub: https://github.com/badbsallyy/docs
2. Click on **Settings** (top right)
3. Scroll down and click on **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Save the changes

### 2. Trigger the Deployment

The deployment will happen automatically when:
- Changes are pushed to the `main` branch
- You manually trigger the workflow from the Actions tab

To manually trigger the deployment:

1. Go to the **Actions** tab in your repository
2. Click on **Deploy HTML Directory to GitHub Pages** workflow
3. Click **Run workflow** button
4. Select the branch (main) and click **Run workflow**

### 3. Access the Deployed Site

Once the workflow completes successfully:

1. Go to the **Actions** tab to verify the deployment succeeded
2. Access your deployed HTML directory at:
   - `https://<username>.github.io/<repository>/` 
   - For this repo: `https://badbsallyy.github.io/docs/`

### Regenerating the HTML Locally

To regenerate the HTML file directory locally:

```bash
# Install dependencies (if not already done)
npm install

# Generate the HTML directory
node generate-directory.js

# View the result
# Open directory/index.html in your browser
```

### What Gets Deployed

The GitHub Actions workflow:
1. Checks out the repository
2. Installs Node.js dependencies
3. Runs the `generate-directory.js` script to create the HTML
4. Deploys only the `directory/` folder to GitHub Pages

### Troubleshooting

If the deployment fails:

1. Check the Actions tab for error logs
2. Ensure GitHub Pages is enabled with "GitHub Actions" as the source
3. Verify the workflow file exists at `.github/workflows/deploy.yml`
4. Make sure the repository has the necessary permissions for Pages deployment

### Manual Deployment (Alternative)

If you prefer not to use GitHub Actions, you can manually deploy:

1. Generate the HTML: `node generate-directory.js`
2. Upload the contents of the `directory/` folder to any web hosting service
3. The `index.html` file is completely standalone and requires no backend
