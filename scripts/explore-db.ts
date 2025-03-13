import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  }
});

async function exploreTables() {
  console.log('Exploring Supabase database tables...\n');

  try {
    // Get list of tables
    const tables = ['advertisers', 'amazon_tokens', 'api_keys', 'campaign_metrics', 'campaigns'];
    
    for (const table of tables) {
      console.log(`\n=== Table: ${table} ===`);
      
      // Get sample data
      const { data, error } = await supabase
        .from(`${table}`)
        .select('*')
        .limit(3);
        
      if (error) {
        console.error(`Error fetching data from ${table}:`, error);
        continue;
      }
      
      // Display column names based on the first row
      if (data && data.length > 0) {
        console.log('Columns:', Object.keys(data[0]).join(', '));
      } else {
        // If no data, try to get column info from an empty select
        const { error: schemaError } = await supabase
          .from(`${table}`)
          .select('*')
          .limit(0);
          
        if (schemaError) {
          console.error(`Error fetching schema for ${table}:`, schemaError);
        } else {
          console.log('Table exists but no data found');
        }
      }
      
      console.log(`\nSample data (${data?.length || 0} rows):`);
      if (data && data.length > 0) {
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log('No data found');
      }
    }
    
    console.log('\nDatabase exploration complete!');
  } catch (error) {
    console.error('Error exploring database:', error);
  }
}

// Run the exploration
exploreTables(); 