#!/usr/bin/env node
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import chalk from 'chalk';
import { spawn } from 'child_process';

console.log(chalk.blue('=== MCP Server Test Client ==='));
console.log(chalk.yellow('Starting test of Amazon Advertising MCP server...'));

// Configuration
const serverPath = './index.js';

// Create a transport that will spawn the server process
const transport = new StdioClientTransport({
  command: 'node',
  args: [serverPath],
  cwd: process.cwd(),
  env: {
    ...process.env,
    DEBUG: 'true',
    SUPABASE_URL: 'https://sdpmxiyzkdypufeedhoz.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkcG14aXl6a2R5cHVmZWVkaG96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTY1NTc3MiwiZXhwIjoyMDU3MjMxNzcyfQ.x9tFYuoewa0I03UoJfAuwZJJLyHkSPCghjTeSLb7EqE',
    API_KEY: 'amzn_ads_0018ad0985a04acc9b4ee7ea791192ba'
  }
});

// Create the client
const client = new Client(
  {
    name: 'test-client',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    }
  }
);

async function runTests() {
  try {
    console.log(chalk.yellow('Connecting to MCP server...'));
    await client.connect(transport);
    console.log(chalk.green('✓ Connected to MCP server'));

    // List available tools
    console.log(chalk.yellow('Listing tools...'));
    const tools = await client.listTools();
    console.log(chalk.green('✓ Available tools:'), tools);

    // Test ping tool
    console.log(chalk.yellow('Testing ping tool...'));
    const pingResult = await client.callTool({
      name: 'ping',
      arguments: {}
    });
    console.log(chalk.green('✓ Ping result:'), pingResult);

    // Test echo tool
    console.log(chalk.yellow('Testing echo tool...'));
    const echoResult = await client.callTool({
      name: 'echo',
      arguments: {
        message: 'Hello, MCP Server!'
      }
    });
    console.log(chalk.green('✓ Echo result:'), echoResult);
    
    // Test validateApiKey tool
    console.log(chalk.yellow('Testing validateApiKey tool...'));
    const validationResult = await client.callTool({
      name: 'validateApiKey',
      arguments: {}
    });
    console.log(chalk.green('✓ API Key validation result:'), validationResult);

    // Test advertiser tools if available
    try {
      console.log(chalk.yellow('Testing getAdvertiserInfo tool...'));
      const advertiserInfo = await client.callTool({
        name: 'getAdvertiserInfo',
        arguments: {}
      });
      console.log(chalk.green('✓ Advertiser info result:'), advertiserInfo);
    } catch (error) {
      console.log(chalk.red('✗ getAdvertiserInfo tool failed:'), error.message);
    }

    console.log(chalk.green('✓ All tests completed successfully'));
  } catch (error) {
    console.error(chalk.red('Error running tests:'), error);
  } finally {
    // Disconnect client
    try {
      console.log(chalk.yellow('Disconnecting...'));
      // Close the transport instead of calling disconnect
      await transport.close();
      console.log(chalk.green('✓ Disconnected from MCP server'));
    } catch (error) {
      console.error(chalk.red('Error disconnecting:'), error);
    }
    process.exit(0);
  }
}

runTests(); 