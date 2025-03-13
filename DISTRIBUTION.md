# Distribution Guide for Amazon Advertising MCP Server

This guide explains how to package and distribute your MCP server for use with the Claude desktop application.

## Packaging Options

### Option 1: Simple ZIP Distribution (Recommended)

The simplest approach is to create a ZIP package with all necessary files that users can extract and run:

1. Run the packaging script:
   ```
   npm run package
   ```

   This will:
   - Build the TypeScript code
   - Create a distribution package in `dist-package/`
   - Copy all necessary files
   - Create an installation script
   - Package everything into a ZIP file: `adspirer-mcp-server-1.0.0.zip`

2. The package includes:
   - All necessary code and dependencies
   - An installation script (`install.js`) that helps users:
     - Set up Supabase credentials securely
     - Configure Claude Desktop automatically
     - Prompt for their Amazon Advertising API key
   - Clear installation instructions

3. Distribute the ZIP file to your users.

### Option 2: Deploy as an npm Package

For more technical users, you can publish this as an npm package:

1. Prepare your package.json:
   - Ensure "main", "type", and other fields are correct
   - Add "bin" field to make the MCP server executable

2. Build and prepare the release:
   ```
   npm run prepare-release
   ```

3. Publish to npm:
   ```
   npm publish
   ```

4. Users can then install globally:
   ```
   npm install -g adspirer-mcp-server
   ```

5. Provide instructions for configuring Claude Desktop with the globally installed package.

### Option 3: Desktop Application Wrapper

For non-technical users, you could create a desktop application wrapper around your MCP server:

1. Use Electron or similar framework to create a desktop application
2. Bundle your MCP server inside
3. Create a user-friendly interface for:
   - Entering Supabase credentials
   - Entering Amazon Advertising API key
   - Testing the connection
   - Automatically configuring Claude Desktop

## Security Considerations

When distributing your MCP server, keep these security considerations in mind:

1. **Never include real API keys or credentials** in the distributed package
2. **Ensure your setup-credentials.js script** properly secures sensitive information
3. **Provide clear instructions** on handling sensitive information
4. **Consider obfuscating your code** if it contains proprietary logic

## User Instructions

Include these instructions with your distributed package:

1. **Prerequisites**:
   - Node.js 14+ installed
   - Claude Desktop application installed
   - Amazon Advertising API key
   - Supabase account with appropriate tables set up

2. **Installation**:
   - Extract the package to a desired location
   - Run `npm install` to install dependencies
   - Run `node install.js` to complete setup

3. **Troubleshooting**:
   - Check mcp-debug.log for errors
   - Run `node test-mcp.js` to test the MCP server
   - Ensure Claude Desktop is properly configured

## Updating

When you release updates:

1. Increment the version number in package.json
2. Document changes clearly
3. Create a new distribution package
4. Explain to users how to safely update their installation

## License Considerations

Ensure your distribution complies with:
- The licenses of all included dependencies
- Any terms of service for the APIs you're using
- Your own licensing desires for this code 