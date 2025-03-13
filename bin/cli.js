#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';
import chalk from 'chalk';
import { spawn } from 'child_process';
import readline from 'readline';

// Get the path to the index.js file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.resolve(__dirname, '../index.js');

// Available commands
const commands = {
  start: 'Start the MCP server',
  config: 'Configure Claude Desktop',
  test: 'Test the MCP connection'
};

// Extract command from arguments
const args = process.argv.slice(2);
const command = args[0] || 'help';

// Helper function to print help
function printHelp() {
  console.log(chalk.blue('\nAmazon Advertising MCP Server for Claude Desktop\n'));
  console.log('Usage: adspirer-mcp [command]\n');
  console.log('Commands:');
  Object.entries(commands).forEach(([cmd, desc]) => {
    console.log(`  ${chalk.green(cmd.padEnd(12))} ${desc}`);
  });
  console.log(`  ${chalk.green('help'.padEnd(12))} Show this help message\n`);
}

// Config command - configure Claude Desktop
function configureClaudeDesktop() {
  console.log(chalk.blue('\nConfiguring Claude Desktop...\n'));
  
  const configPaths = {
    win32: path.join(process.env.APPDATA, 'Claude', 'config.json'),
    darwin: path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'config.json'),
    linux: path.join(os.homedir(), '.config', 'Claude', 'config.json')
  };
  
  const configPath = configPaths[process.platform];
  if (!configPath) {
    console.log(chalk.red('\nUnsupported operating system for automatic Claude Desktop configuration.'));
    console.log('Please manually add the MCP server configuration to your Claude Desktop config file.');
    return;
  }
  
  console.log(`Configuring Claude Desktop at: ${configPath}`);
  
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

  // Create readline interface for input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  // Prompt for API key
  rl.question(chalk.yellow('\nEnter your Amazon Advertising API Key: '), (apiKey) => {
    // Configure the MCP server in Claude Desktop
    config.mcpServers['amazon-ads'] = {
      command: 'adspirer-mcp',
      args: ['start'],
      env: {
        API_KEY: apiKey,
        NODE_ENV: 'production'
      }
    };
    
    // Write the updated config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(chalk.green(`\nClaude Desktop configuration updated at: ${configPath}`));
    console.log('You can now use the Amazon Advertising MCP Server with Claude Desktop.');
    rl.close();
  });
}

// Test command - run the test-mcp-connection.js script
function runTest() {
  console.log(chalk.blue('\nTesting MCP connection...\n'));
  const testPath = path.resolve(__dirname, '../scripts/test-mcp-connection.js');
  
  // Use dynamic import for the test script
  import(testPath)
    .catch(error => {
      console.error(chalk.red('\nError during test:'), error);
    });
}

// Start command - run the MCP server
function startMcpServer() {
  console.log(chalk.blue('\nStarting Amazon Advertising MCP Server...\n'));
  
  // Run the index.js file directly
  const child = spawn('node', [indexPath], {
    stdio: 'inherit'
  });
  
  child.on('error', (error) => {
    console.error(chalk.red('\nError starting MCP server:'), error);
  });
}

// Process commands
switch (command) {
  case 'start':
    startMcpServer();
    break;
  case 'config':
    configureClaudeDesktop();
    break;
  case 'test':
    runTest();
    break;
  case 'help':
    printHelp();
    break;
  default:
    console.log(chalk.red(`\nUnknown command: ${command}`));
    printHelp();
} 