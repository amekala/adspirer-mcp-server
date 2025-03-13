import { supabase } from '../config/supabase.js';

async function exploreTables() {
  console.log('Exploring Supabase database tables...\n');

  try {
    // Get list of tables
    const tables = ['advertisers', 'amazon_tokens', 'api_keys', 'campaign_metrics', 'campaigns'];
    
    for (const table of tables) {
      console.log(`\n=== Table: ${table} ===`);
      
      // Get table schema
      const { data: columns, error: schemaError } = await supabase
        .from(`${table}`)
        .select('*')
        .limit(0);
        
      if (schemaError) {
        console.error(`Error fetching schema for ${table}:`, schemaError);
        continue;
      }
      
      // Display column names based on the first row structure
      if (columns) {
        console.log('Columns:', Object.keys(columns).length > 0 
          ? Object.keys(columns[0] || {}).join(', ') 
          : 'No columns found');
      }
      
      // Get sample data
      const { data, error } = await supabase
        .from(`${table}`)
        .select('*')
        .limit(3);
        
      if (error) {
        console.error(`Error fetching data from ${table}:`, error);
        continue;
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

export async function listTables(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) {
      console.error('Error listing tables:', error);
      return [];
    }

    return data.map(table => table.table_name);
  } catch (error) {
    console.error('Error in listTables:', error);
    return [];
  }
}

export async function describeTable(tableName: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', tableName);

    if (error) {
      console.error(`Error describing table ${tableName}:`, error);
      return [];
    }

    return data;
  } catch (error) {
    console.error(`Error in describeTable for ${tableName}:`, error);
    return [];
  }
} 