#!/usr/bin/env node

// Amazon Advertising MCP Server for Claude Desktop
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import dotenv from 'dotenv';
import { supabase, validateApiKey } from './src/config/supabase.js';
import { AdvertiserService } from './src/services/advertiser.service.js';
import fs from 'fs';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Set up debugging log
const logFile = fs.createWriteStream('mcp-debug.log', { flags: 'a' });
function debug(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  logFile.write(logMessage);
  // Also log to stderr for console viewing during development
  console.error(logMessage);
}

debug('Starting Amazon Advertising MCP Server...');
debug(`MCP Server Version: ${process.env.MCP_SERVER_VERSION || 'dev'}`);
debug(`Received API_KEY: ${process.env.API_KEY ? 'YES (set)' : 'NO (not set)'}`);
debug(`Environment variables: ${JSON.stringify(process.env, (key, value) => {
  // Mask sensitive values but show which variables exist
  if (key.toUpperCase().includes('KEY') || key.toUpperCase().includes('SECRET')) {
    return value ? '[SET]' : '[NOT SET]';
  }
  return value;
}, 2)}`);

// Initialize MCP Server
const server = new McpServer({
  name: "Amazon Advertising",
  version: process.env.MCP_SERVER_VERSION || '1.0.0'
});

// Define the getAdvertiserInfo tool with proper schema format
server.tool("getAdvertiserInfo", 
  {}, // Empty schema since no parameters needed
  async () => {
    debug('Received request for getAdvertiserInfo');
    
    try {
      // For testing, get the first advertiser from the database
      const { data: advertisers, error } = await supabase
        .from('advertisers')
        .select('*')
        .limit(1);
        
      if (error || !advertisers || advertisers.length === 0) {
        debug(`Error or no advertisers found: ${error ? error.message : 'No advertisers'}`);
        return {
          content: [{ type: "text", text: "Error: No advertiser accounts found" }],
          isError: true
        };
      }
      
      const advertiser = advertisers[0];
      debug(`Found advertiser: ${advertiser.account_name}`);
      
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            id: advertiser.id,
            name: advertiser.account_name,
            marketplace: advertiser.marketplace,
            accountType: advertiser.account_type,
            profileId: advertiser.profile_id,
            countryCode: advertiser.metadata?.countryCode || 'Unknown',
            currencyCode: advertiser.metadata?.currencyCode || 'USD'
          }, null, 2)
        }]
      };
    } catch (error) {
      debug(`Error getting advertiser info: ${error.message}`);
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Define the listAdvertiserAccounts tool with proper schema format
server.tool("listAdvertiserAccounts", 
  {}, // Empty schema since no parameters needed
  async () => {
    debug('Received request for listAdvertiserAccounts');
    
    try {
      // Get all advertisers
      const { data: advertisers, error } = await supabase
        .from('advertisers')
        .select('id, account_name, marketplace, account_type, metadata')
        .order('account_name', { ascending: true });
        
      if (error) {
        debug(`Error fetching advertisers: ${error.message}`);
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }],
          isError: true
        };
      }
      
      if (!advertisers || advertisers.length === 0) {
        debug('No advertisers found');
        return {
          content: [{ 
            type: "text", 
            text: "No advertiser accounts were found in the database"
          }]
        };
      }
      
      // Format the advertiser data
      const formattedAdvertisers = advertisers.map(adv => ({
        id: adv.id,
        accountName: adv.account_name,
        marketplace: adv.marketplace,
        accountType: adv.account_type,
        countryCode: adv.metadata?.countryCode || 'Unknown',
        currencyCode: adv.metadata?.currencyCode || 'USD'
      }));
      
      debug(`Found ${formattedAdvertisers.length} advertisers`);
      
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(formattedAdvertisers, null, 2)
        }]
      };
    } catch (error) {
      debug(`Error listing advertiser accounts: ${error.message}`);
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Add a simple non-database dependent tool for testing connectivity
server.tool("ping", 
  {}, // No parameters needed
  async () => {
    debug('Received ping request - testing connection');
    return {
      content: [{ 
        type: "text", 
        text: `Server is running correctly!
Time: ${new Date().toISOString()}
Server name: Amazon Advertising
Server version: ${process.env.MCP_SERVER_VERSION || '1.0.0'}`
      }]
    };
  }
);

// Add an echo tool for testing with parameters
server.tool("echo", 
  { message: z.string() },
  async ({ message }) => {
    debug(`Received echo request with message: ${message}`);
    return {
      content: [{ 
        type: "text", 
        text: `You said: ${message}`
      }]
    };
  }
);

// Add a tool for validating API key that doesn't rely on database access
server.tool("validateApiKey", 
  {}, // No parameters needed
  async () => {
    debug('Received request to validate API key');
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      debug('No API key provided in environment variables');
      return {
        content: [{ 
          type: "text", 
          text: `Error: No API_KEY provided in environment variables.`
        }],
        isError: true
      };
    }
    
    try {
      debug(`Attempting to validate API key: ${apiKey.substring(0, 8)}...`);
      const { valid, advertiserId, error } = await validateApiKey(apiKey);
      
      if (!valid) {
        debug(`API key validation failed: ${error}`);
        return {
          content: [{ 
            type: "text", 
            text: `API key validation failed: ${error || 'Unknown error'}`
          }],
          isError: true
        };
      }
      
      debug(`API key validated successfully for advertiser ID: ${advertiserId}`);
      return {
        content: [{ 
          type: "text", 
          text: `API key is valid for advertiser ID: ${advertiserId}`
        }]
      };
    } catch (error) {
      debug(`Error validating API key: ${error.message}`);
      return {
        content: [{ 
          type: "text", 
          text: `Error validating API key: ${error.message}. This could be due to missing database credentials.`
        }],
        isError: true
      };
    }
  }
);

// Start the server with stdin/stdout transport
debug('Starting MCP server with stdio transport');
const transport = new StdioServerTransport();

// Add better error handling for server connection
try {
  debug('Attempting to connect MCP server to transport');
  server.connect(transport).then(() => {
    debug('MCP server successfully connected to transport and ready to handle requests from Claude Desktop');
    
    // Keep the process alive
    process.on('SIGINT', () => {
      debug('Received SIGINT, shutting down server...');
      process.exit(0);
    });
  }).catch(error => {
    debug(`Error connecting MCP server to transport: ${error.message}\n${error.stack}`);
  });
} catch (error) {
  debug(`Critical error starting MCP server: ${error.message}\n${error.stack}`);
}

// Add heartbeat logging to confirm server is alive
setInterval(() => {
  debug('MCP server heartbeat - still running');
}, 60000); // Log every minute

// Add error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  debug(`Uncaught exception: ${error.message}\n${error.stack}`);
  // Keep the server running despite errors
});

process.on('unhandledRejection', (reason, promise) => {
  debug(`Unhandled promise rejection: ${reason}`);
  // Keep the server running despite errors
}); 