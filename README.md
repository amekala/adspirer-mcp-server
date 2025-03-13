# Ads Manager MCP server for Claude

Transform your advertising experience with AI-powered insights and management - right inside Claude!

## What It Does

This Ads MCP server is your AI assistant for managing digital advertising campaigns. Through simple conversations in Claude, you can:

- Analyze campaign performance and get actionable insights
- Create and manage advertising campaigns
- Visualize campaign metrics with interactive charts
- Receive personalized optimization recommendations
- Adjust budgets, bids, and targeting on the fly
- Get alerts for underperforming campaigns

No more switching between multiple dashboards and reports - just chat naturally with Claude!

## Platforms Supported

- **Amazon Ads** - Available now!
- **Walmart Ads** - Coming soon
- **Meta Ads** - Coming soon
- **Google Ads** - Coming soon

## Getting Started

### 1. Get Your API Key

Visit [Adspirer.com](https://www.adspirer.com/) to connect your ad accounts:
- Sign up for a free account
- Connect your advertising accounts via platform authentication
- Copy your API key from your dashboard

### 2. Install the Server

```bash
# Install globally with npm
npm install -g adspirer-mcp-server

# Configure Claude Desktop automatically
adspirer-mcp config
```

During configuration, you'll be prompted for your API key from Adspirer.

### 3. Claude Desktop Configuration

The `adspirer-mcp config` command will automatically update your Claude Desktop configuration file, but you can also manually set it up:

```json
{
  "mcpServers": {
    "adspirer": {
      "command": "adspirer-mcp",
      "args": ["start"],
      "env": {
        "API_KEY": "your_api_key_here"
      }
    }
  }
}
```

Save this to:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

### 4. Start Using It in Claude!

Open Claude and start asking about your campaigns:
- "How are my Amazon ad campaigns performing this week?"
- "Show me a chart of my best performing keywords"
- "Increase the budget for my 'Summer Sale' campaign by 20%"

## Examples

Ask Claude questions like:
- "Which campaigns have the best RoAS?"
- "Show me trends in my ad spend over the last 30 days"
- "What optimization opportunities do you see in my campaigns?"
- "Create a new Sponsored Products campaign for my top selling item"

## Troubleshooting

Having issues?
- Make sure Claude Desktop is running the latest version
- Check that your API key is entered correctly
- Run `adspirer-mcp test` to verify your connection

## Resources

- [Full Documentation](https://docs.adspirer.com)
- [Video Tutorial](https://adspirer.com/tutorials)
- [Support](https://adspirer.com/support)

---

Built with ❤️ by Adspirer - Supercharging Advertisers with AI
