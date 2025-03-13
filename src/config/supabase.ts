import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  }
});

// Function to validate an API key against the database
export async function validateApiKey(apiKey: string): Promise<{ 
  valid: boolean, 
  advertiserId?: string,
  error?: string 
}> {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('advertiser_id, active')
      .eq('key', apiKey)
      .single();

    if (error) {
      return { valid: false, error: 'Invalid API key' };
    }

    if (!data || !data.active) {
      return { valid: false, error: 'API key is inactive or invalid' };
    }

    return { valid: true, advertiserId: data.advertiser_id };
  } catch (error) {
    console.error('Error validating API key:', error);
    return { valid: false, error: 'Error validating API key' };
  }
} 