# Amazon Advertising MCP Server - For Technical Users

This guide is for technical users who want to install and configure the Amazon Advertising MCP Server for Claude Desktop using npm and command-line tools.

## Installation

### Method 1: Global npm Installation (Recommended)

The MCP server can be installed globally, making it available from anywhere in your command line:

```bash
# Install globally
npm install -g adspirer-mcp-server

# Configure Claude Desktop to use the MCP server
adspirer-mcp config

# Test the MCP connection
adspirer-mcp test
```

During the configuration process, you will be prompted to enter your Amazon Advertising API key. This is the only credential you need to provide.

### Method 2: Local Installation from Source

You can also clone the repository and install locally:

```bash
# Clone repository
git clone https://github.com/yourusername/adspirer-mcp-server.git
cd adspirer-mcp-server

# Install dependencies
npm install

# Configure Claude Desktop
adspirer-mcp config
```

## Claude Desktop Configuration

The command `adspirer-mcp config` will automatically configure Claude Desktop to use the correct command without absolute paths:

```json
{
  "mcpServers": {
    "amazon-ads": {
      "command": "adspirer-mcp",
      "args": ["start"],
      "env": {
        "API_KEY": "your_api_key_here",
        "NODE_ENV": "production"
      }
    }
  }
}
```

This configuration uses the globally installed `adspirer-mcp` command, making it portable across different machines without needing to specify absolute paths.

## API Key

The Amazon Advertising API key is the only credential you need to provide. This is your personal key that gives you access to Amazon Advertising data. The MCP server uses this key to authenticate your requests.

You can obtain an Amazon Advertising API key from the Amazon Advertising console or your account manager.

## How It Works

1. The MCP server uses your Amazon Advertising API key to authenticate requests
2. All data is securely fetched and stored in a private backend database
3. You don't need to know any details about the database infrastructure
4. Your API key only gives access to your own data

## Usage

Once installed, you can start the MCP server with:

```bash
adspirer-mcp start
```

This will launch the MCP server that Claude Desktop will communicate with.

## Development and Customization

If you want to modify the MCP server:

1. Clone the repository
2. Make your changes
3. Build with `npm run build`
4. Test locally with `npm start` or `node index.js`

You can also link your local development version globally:

```bash
# In the repository directory
npm link

# Now you can use your development version globally
adspirer-mcp start
```

## Troubleshooting

Common issues:

1. **Claude Desktop can't find the MCP server**
   - Ensure the global package is properly installed
   - Check that the command exists in your PATH: `which adspirer-mcp`

2. **Authentication failures**
   - Verify your API key is correct
   - Ensure your API key is active and properly formatted

3. **Path-related errors**
   - This is why we use the global command approach - no absolute paths! 