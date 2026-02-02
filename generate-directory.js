const fs = require('fs-extra');
const path = require('path');

// Function to get directory structure recursively
function getDirectoryStructure(dir, basePath = '') {
    const items = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(basePath, entry.name);
        
        if (entry.isDirectory()) {
            items.push({
                name: entry.name,
                type: 'directory',
                path: relativePath,
                children: getDirectoryStructure(fullPath, relativePath)
            });
        } else {
            items.push({
                name: entry.name,
                type: 'file',
                path: relativePath,
                size: fs.statSync(fullPath).size
            });
        }
    }
    
    // Sort: directories first, then files, both alphabetically
    return items.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    });
}

// Function to format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// Function to generate HTML for directory tree
function generateHTML(structure, level = 0) {
    let html = '';
    
    for (const item of structure) {
        const indent = '  '.repeat(level);
        const icon = item.type === 'directory' ? '📁' : '📄';
        
        if (item.type === 'directory') {
            html += `${indent}<details class="directory">\n`;
            html += `${indent}  <summary>${icon} <strong>${item.name}</strong></summary>\n`;
            html += `${indent}  <div class="directory-content">\n`;
            html += generateHTML(item.children, level + 2);
            html += `${indent}  </div>\n`;
            html += `${indent}</details>\n`;
        } else {
            html += `${indent}<div class="file">${icon} ${item.name} <span class="file-size">(${formatFileSize(item.size)})</span></div>\n`;
        }
    }
    
    return html;
}

// Main function
function generateDirectoryListing() {
    const srcDir = path.join(__dirname, 'src');
    const outputDir = path.join(__dirname, 'directory');
    
    // Create output directory
    fs.ensureDirSync(outputDir);
    
    // Get directory structure
    console.log('Scanning src directory...');
    const structure = getDirectoryStructure(srcDir);
    
    // Generate HTML
    console.log('Generating HTML...');
    const htmlContent = generateHTML(structure);
    
    // Create complete HTML page
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Puter.js Documentation - File Directory</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }
        
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px;
        }
        
        .directory-tree {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            border: 1px solid #e9ecef;
        }
        
        details {
            margin: 5px 0;
        }
        
        summary {
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 4px;
            transition: all 0.2s;
            user-select: none;
        }
        
        summary:hover {
            background: rgba(102, 126, 234, 0.1);
        }
        
        .directory-content {
            margin-left: 20px;
            padding-left: 15px;
            border-left: 2px solid #dee2e6;
        }
        
        .file {
            padding: 6px 12px;
            margin: 3px 0;
            border-radius: 4px;
            transition: all 0.2s;
        }
        
        .file:hover {
            background: rgba(102, 126, 234, 0.05);
        }
        
        .file-size {
            color: #6c757d;
            font-size: 0.9em;
            float: right;
        }
        
        footer {
            text-align: center;
            padding: 20px;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
        }
        
        .stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }
        
        .stat-label {
            color: #6c757d;
            font-size: 0.9em;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📚 Puter.js Documentation</h1>
            <p>Complete File Directory Structure</p>
        </header>
        
        <div class="content">
            <div class="stats">
                <div class="stat">
                    <div class="stat-value" id="total-files">-</div>
                    <div class="stat-label">Total Files</div>
                </div>
                <div class="stat">
                    <div class="stat-value" id="total-dirs">-</div>
                    <div class="stat-label">Directories</div>
                </div>
                <div class="stat">
                    <div class="stat-value" id="total-size">-</div>
                    <div class="stat-label">Total Size</div>
                </div>
            </div>
            
            <h2 style="margin-bottom: 15px;">📂 src/</h2>
            <div class="directory-tree">
${htmlContent}
            </div>
        </div>
        
        <footer>
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p style="margin-top: 10px;">
                <a href="https://github.com/badbsallyy/docs" target="_blank" style="color: #667eea; text-decoration: none;">
                    View on GitHub
                </a>
            </p>
        </footer>
    </div>
    
    <script>
        // Calculate statistics
        function calculateStats() {
            const files = document.querySelectorAll('.file').length;
            const dirs = document.querySelectorAll('.directory').length;
            
            // Extract all file sizes and sum them
            const fileSizes = Array.from(document.querySelectorAll('.file-size')).map(el => {
                const text = el.textContent;
                const match = text.match(/\\(([0-9.]+)\\s*(B|KB|MB)\\)/);
                if (match) {
                    const value = parseFloat(match[1]);
                    const unit = match[2];
                    if (unit === 'KB') return value * 1024;
                    if (unit === 'MB') return value * 1024 * 1024;
                    return value;
                }
                return 0;
            });
            
            const totalSize = fileSizes.reduce((a, b) => a + b, 0);
            
            // Update UI
            document.getElementById('total-files').textContent = files;
            document.getElementById('total-dirs').textContent = dirs;
            
            // Format total size
            let sizeText;
            if (totalSize < 1024) {
                sizeText = totalSize.toFixed(0) + ' B';
            } else if (totalSize < 1024 * 1024) {
                sizeText = (totalSize / 1024).toFixed(2) + ' KB';
            } else {
                sizeText = (totalSize / (1024 * 1024)).toFixed(2) + ' MB';
            }
            document.getElementById('total-size').textContent = sizeText;
        }
        
        // Run on page load
        calculateStats();
        
        // Open all directories by default
        document.querySelectorAll('details').forEach(detail => {
            detail.open = true;
        });
    </script>
</body>
</html>`;
    
    // Write HTML file
    const outputFile = path.join(outputDir, 'index.html');
    fs.writeFileSync(outputFile, fullHTML);
    
    console.log(`✅ HTML directory listing generated at: ${outputFile}`);
    
    // Count statistics
    function countItems(structure) {
        let files = 0;
        let dirs = 0;
        let totalSize = 0;
        
        for (const item of structure) {
            if (item.type === 'directory') {
                dirs++;
                const childStats = countItems(item.children);
                files += childStats.files;
                dirs += childStats.dirs;
                totalSize += childStats.totalSize;
            } else {
                files++;
                totalSize += item.size;
            }
        }
        
        return { files, dirs, totalSize };
    }
    
    const stats = countItems(structure);
    console.log(`\nStatistics:`);
    console.log(`  Files: ${stats.files}`);
    console.log(`  Directories: ${stats.dirs}`);
    console.log(`  Total Size: ${formatFileSize(stats.totalSize)}`);
}

// Run the generator
generateDirectoryListing();
