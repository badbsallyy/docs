# HTML File Directory

This directory contains an automatically generated HTML file listing of the entire `src` folder structure.

## Files

- `index.html` - The main HTML file that displays the complete directory structure

## How it works

The `generate-directory.js` script scans the `src` folder and generates a beautiful, interactive HTML page that shows:

- All files and directories in a tree structure
- File sizes for each file
- Statistics (total files, directories, and size)
- Expandable/collapsible folders

## Deployment

This directory is automatically deployed to GitHub Pages via GitHub Actions whenever changes are pushed to the main branch.

## Local Development

To regenerate the HTML directory locally:

```bash
node generate-directory.js
```

Then open `directory/index.html` in your browser to view the result.
