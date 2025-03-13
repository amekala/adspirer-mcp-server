// Script to test MCP server connection
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// API Key from environment or use your hard-coded key for testing
const API_KEY = process.env.TEST_API_KEY || 'amzn_ads_0018ad0985a04acc9b4ee7ea791192ba';

// MCP server URL
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3000';

async function testMcpConnection() {
  console.log('Testing MCP server connection...');
  console.log(`Server URL: ${MCP_SERVER_URL}`);
  console.log(`Using API Key: ${API_KEY}`);
  
  try {
    // Test the info endpoint
    console.log('\n1. Testing server info endpoint...');
    const infoResponse = await axios.get(`${MCP_SERVER_URL}/mcp/info`);
    console.log('Server Info:');
    console.log(JSON.stringify(infoResponse.data, null, 2));
    
    // Test authentication
    console.log('\n2. Testing authentication...');
    const authResponse = await axios.post(`${MCP_SERVER_URL}/mcp/authenticate`, {
      authToken: API_KEY
    });
    console.log('Authentication Response:');
    console.log(JSON.stringify(authResponse.data, null, 2));
    
    if (!authResponse.data.success) {
      console.error('Authentication failed. Cannot proceed with context tests.');
      return;
    }
    
    // Get the session token from the auth response
    const sessionToken = authResponse.data.sessionToken;
    
    // Test current advertiser context provider
    console.log('\n3. Testing current advertiser context provider...');
    const advertiserResponse = await axios.post(`${MCP_SERVER_URL}/mcp/context`, {
      sessionToken,
      providerName: 'advertiser',
      parameters: {}
    });
    console.log('Current Advertiser Response:');
    console.log(JSON.stringify(advertiserResponse.data, null, 2));
    
    // Test all advertisers context provider
    console.log('\n4. Testing all advertisers context provider...');
    const advertisersResponse = await axios.post(`${MCP_SERVER_URL}/mcp/context`, {
      sessionToken,
      providerName: 'advertisers',
      parameters: {}
    });
    console.log('All Advertisers Response:');
    console.log(JSON.stringify(advertisersResponse.data, null, 2));
    
    // Test campaigns context provider
    console.log('\n5. Testing campaigns context provider...');
    const campaignsResponse = await axios.post(`${MCP_SERVER_URL}/mcp/context`, {
      sessionToken,
      providerName: 'campaigns',
      parameters: {}
    });
    console.log('Campaigns Context Response:');
    console.log(JSON.stringify(campaignsResponse.data, null, 2));
    
    console.log('\nMCP connection test completed successfully!');
  } catch (error) {
    console.error('Error testing MCP connection:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run the test
testMcpConnection(); 