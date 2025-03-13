# Amazon Advertising MCP Server for Claude Desktop

This is a Model Context Protocol (MCP) server that enables Claude to access data from your Amazon Advertising accounts through the Claude Desktop application.

## Features

- Authenticates via API keys stored in your Supabase database
- Provides tools for Claude to access Amazon Advertising data:
  - `getAdvertiserInfo` - Get information about the current advertiser account
  - `listAdvertiserAccounts` - List all available advertiser accounts
  - `ping` - Simple connectivity test
  - `echo` - Test tool with parameters
  - `validateApiKey` - Verify your API key is working

## Installation Options

### For Technical Users (npm global installation)

The easiest way to install and configure the MCP server is via npm:

```bash
# Install globally
npm install -g adspirer-mcp-server

# Set up your Supabase credentials
adspirer-mcp setup

# Configure Claude Desktop automatically
adspirer-mcp config

# Test your MCP server
adspirer-mcp test
```

See [TECHNICAL_USERS.md](TECHNICAL_USERS.md) for detailed instructions for technical users.

### Manual Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up Supabase credentials securely:
   ```
   node setup-credentials.js
   ```
   This will prompt you to enter your Supabase URL and key, which will be stored securely in a `.env.supabase` file with restricted permissions.

3. Run the MCP server manually for testing:
   ```
   npm start
   ```
   Or use the test script to verify everything is working:
   ```
   node test-mcp.js
   ```

## Claude Desktop Integration

To use this MCP server with Claude Desktop, create/edit the Claude config file:

- Windows: `%APPDATA%\Claude\config.json`
- macOS: `~/Library/Application Support/Claude/config.json`
- Linux: `~/.config/Claude/config.json`

Add the following configuration:

```json
{
  "mcpServers": {
    "amazon-ads": {
      "command": "node",
      "args": ["/absolute/path/to/your/project/index.js"],
      "cwd": "/absolute/path/to/your/project",
      "env": {
        "API_KEY": "your_api_key_here",
        "NODE_ENV": "production",
        "DEBUG": "true",
        "MCP_SERVER_VERSION": "1.0.0"
      }
    }
  }
}
```

Replace:
- `/absolute/path/to/your/project` with the full path to your project directory
- `your_api_key_here` with your Amazon Advertising API key

**Important Note:** You only need to provide your API key in the configuration. The server will load the database credentials securely from your .env.supabase file.

## Security Features

- Supabase credentials are never exposed in the Claude Desktop configuration
- Sensitive database credentials are stored in a separate `.env.supabase` file with restricted permissions
- The server can load credentials from multiple sources (environment variables, config file, or defaults for development)
- Proper error handling when credentials are missing or incorrect

## Database Structure

The server expects the following tables in your Supabase database:

- `api_keys` - Stores API keys for authentication
- `advertisers` - Stores advertiser account information
- `campaigns` - Stores campaign data
- `campaign_metrics` - Stores performance metrics for campaigns

## Using with Claude

Once configured, you can ask Claude questions about your Amazon Advertising data:

1. "Show me my current advertiser account information"
2. "List all my advertiser accounts"
3. "Show me my recent campaigns and their performance"

Claude will use the MCP server to retrieve real-time data from your Supabase database.

## Troubleshooting

- If authentication fails, check that your API key is valid and properly formatted
- Make sure you've run `node setup-credentials.js` to set up your Supabase credentials
- Check the `mcp-debug.log` file for detailed error messages
- Run `node test-mcp.js` to verify that your MCP server is working correctly 