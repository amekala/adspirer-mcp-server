#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const rootDir = path.join(__dirname, '..');
const packageJson = require('../package.json');
const distDir = path.join(rootDir, 'dist-package');

async function createPackage() {
  console.log('Creating distribution package...');
  
  // Create dist directory if it doesn't exist
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  } else {
    // Clean existing files in dist directory
    fs.readdirSync(distDir).forEach(file => {
      const filePath = path.join(distDir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
    });
  }

  // Copy necessary files
  const filesToCopy = [
    'dist', 
    'node_modules',
    'package.json',
    'package-lock.json',
    'README.md',
    'setup-credentials.js',
    'index.js',
    'claude-desktop-config.json',
    '.env.example'
  ];

  filesToCopy.forEach(file => {
    const sourcePath = path.join(rootDir, file);
    const destPath = path.join(distDir, file);
    
    if (fs.existsSync(sourcePath)) {
      if (fs.lstatSync(sourcePath).isDirectory()) {
        fs.cpSync(sourcePath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  });

  // Create installation script
  const installScript = `#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const os = require('os');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\\n=== Amazon Advertising MCP Server for Claude Desktop - Setup ===\\n');

function runSetup() {
  console.log('Running setup...');
  try {
    // Run setup-credentials.js to securely set up Supabase credentials
    console.log('\\nSetting up Supabase credentials...');
    require('./setup-credentials.js');
    
    // Create Claude Desktop configuration
    setupClaudeDesktop();
  } catch (error) {
    console.error('Error during setup:', error);
  }
}

function setupClaudeDesktop() {
  const configPaths = {
    win32: path.join(process.env.APPDATA, 'Claude', 'config.json'),
    darwin: path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'config.json'),
    linux: path.join(os.homedir(), '.config', 'Claude', 'config.json')
  };
  
  const configPath = configPaths[process.platform];
  if (!configPath) {
    console.log('\\nUnsupported operating system for automatic Claude Desktop configuration.');
    console.log('Please manually add the MCP server configuration to your Claude Desktop config file.');
    return;
  }
  
  console.log(\`\\nConfiguring Claude Desktop at: \${configPath}\`);
  
  // Check if the Claude config directory exists
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    console.log('Claude Desktop config directory does not exist. Creating it...');
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  // Read existing config or create new one
  let config = {};
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log('Existing Claude Desktop configuration found.');
    } catch (e) {
      console.log('Error reading Claude Desktop config. Creating a new one.');
    }
  }
  
  // Ensure mcpServers object exists
  if (!config.mcpServers) config.mcpServers = {};
  
  // Get current directory
  const currentDir = process.cwd();
  
  // Set up the MCP server configuration
  rl.question('\\nEnter your Amazon Advertising API Key: ', (apiKey) => {
    config.mcpServers['amazon-ads'] = {
      command: 'node',
      args: [path.join(currentDir, 'index.js')],
      cwd: currentDir,
      env: {
        API_KEY: apiKey,
        NODE_ENV: 'production'
      }
    };
    
    // Write the updated config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(\`\\nClaude Desktop configuration updated at: \${configPath}\`);
    console.log('\\nSetup complete! You can now use the Amazon Advertising MCP Server with Claude Desktop.');
    rl.close();
  });
}

runSetup();
`;

  fs.writeFileSync(path.join(distDir, 'install.js'), installScript);
  fs.chmodSync(path.join(distDir, 'install.js'), '755');

  // Create simple README with installation instructions
  const readmeContent = `# Amazon Advertising MCP Server for Claude Desktop

## Installation

1. Extract this package to a directory on your computer
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Run the installation script:
   \`\`\`
   node install.js
   \`\`\`
   This will:
   - Set up your Supabase credentials securely
   - Configure Claude Desktop to use this MCP server
   - Prompt you for your Amazon Advertising API Key

## Manual Configuration

If the automatic setup doesn't work, you can configure Claude Desktop manually:

- Edit your Claude Desktop config file:
  - Windows: \`%APPDATA%\\Claude\\config.json\`
  - macOS: \`~/Library/Application Support/Claude/config.json\`
  - Linux: \`~/.config/Claude/config.json\`

- Add this configuration (replace paths and API key with your own):
\`\`\`json
{
  "mcpServers": {
    "amazon-ads": {
      "command": "node",
      "args": ["/absolute/path/to/extracted/package/index.js"],
      "cwd": "/absolute/path/to/extracted/package",
      "env": {
        "API_KEY": "your_api_key_here",
        "NODE_ENV": "production"
      }
    }
  }
}
\`\`\`
`;

  fs.writeFileSync(path.join(distDir, 'INSTALL.md'), readmeContent);

  // Create archive
  try {
    const packageName = `${packageJson.name}-${packageJson.version}`;
    const archivePath = path.join(rootDir, `${packageName}.zip`);
    
    console.log(`Creating archive: ${archivePath}`);
    await execAsync(`cd "${distDir}" && zip -r "${archivePath}" .`);
    
    console.log(`\nDistribution package created successfully at: ${archivePath}`);
    console.log('You can distribute this ZIP file to your users.');
  } catch (error) {
    console.error('Error creating archive:', error);
  }
}

createPackage().catch(console.error); 