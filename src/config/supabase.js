import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables (for development)
dotenv.config();

// Function to write debug info
const writeDebug = (message) => {
  if (process.env.DEBUG === 'true') {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;
    try {
      const logFile = fs.createWriteStream('mcp-debug.log', { flags: 'a' });
      logFile.write(logMessage);
      console.error(logMessage);
    } catch (error) {
      console.error(`Error writing to log: ${error.message}`);
    }
  }
};

// These values will be replaced during build with actual values from .env
// Users will never see or need to provide these credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

writeDebug('Supabase client initialization complete');

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  }
});

// Function to validate an API key against the database
export async function validateApiKey(apiKey) {
  try {
    // First check the 'key' column (based on database.types.ts)
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('advertiser_id, active')
      .eq('key', apiKey)
      .single();

    if (!keyError && keyData) {
      return { 
        valid: keyData.active === true, 
        advertiserId: keyData.advertiser_id,
        error: keyData.active !== true ? 'API key is inactive' : undefined
      };
    }

    // If not found, check the 'key_value' column (based on explore-db.js output)
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, user_id')
      .eq('key_value', apiKey)
      .eq('is_active', true)
      .single();

    if (error) {
      return { valid: false, error: 'Invalid API key' };
    }

    if (!data) {
      return { valid: false, error: 'API key not found' };
    }

    // If we have a user_id but no advertiser_id, try to get the first advertiser for this user
    if (data.user_id) {
      const { data: advertiser, error: advError } = await supabase
        .from('advertisers')
        .select('id')
        .eq('user_id', data.user_id)
        .limit(1)
        .single();

      if (!advError && advertiser) {
        return { valid: true, advertiserId: advertiser.id };
      }
    }

    return { valid: true, advertiserId: data.id };
  } catch (error) {
    console.error('Error validating API key:', error);
    return { valid: false, error: 'Error validating API key' };
  }
} 