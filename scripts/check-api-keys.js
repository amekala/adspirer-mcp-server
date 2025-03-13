// Script to check the api_keys table structure
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from project root
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

async function checkApiKeysTable() {
  try {
    // Option 1: List all tables to confirm api_keys exists
    console.log('Checking database schema...');
    const { data: tables, error: schemaError } = await supabase
      .rpc('get_tables'); // This RPC function might not exist, so we'll try another approach if it fails
    
    if (!schemaError && tables) {
      console.log('Tables in database:', tables);
    } else {
      console.log('Could not retrieve tables using RPC, trying a different approach...');
    }
    
    // Option 2: Direct SQL query to get table info (this requires higher privileges)
    const { data: tableInfo, error: tableError } = await supabase
      .from('api_keys')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('Error accessing api_keys table:', tableError);
    } else {
      console.log('Successfully accessed api_keys table!');
      if (tableInfo && tableInfo.length > 0) {
        console.log('First record:', tableInfo[0]);
        console.log('Columns:', Object.keys(tableInfo[0]).join(', '));
      } else {
        console.log('The api_keys table exists but contains no records.');
        // Try to get column names from an empty table
        const { data: emptyData, error: emptyError } = await supabase
          .from('api_keys')
          .select('*')
          .limit(0);
          
        if (!emptyError) {
          console.log('Table exists, but no data to show column structure.');
        }
      }
    }
    
    // Option 3: Try introspection (may or may not work depending on permissions)
    console.log('\nTrying to get all tables via introspection...');
    try {
      const { data: allTables, error: allError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
        
      if (!allError) {
        console.log('Tables found via introspection:', allTables.map(t => t.table_name).join(', '));
      } else {
        console.error('Error getting tables via introspection:', allError);
      }
    } catch (e) {
      console.error('Exception during introspection:', e);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
checkApiKeysTable(); 