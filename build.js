// build.js
import esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a custom dotenv plugin since esbuild-plugin-dotenv is not available
const dotenvPlugin = () => ({
  name: 'dotenv',
  setup(build) {
    // Load .env file
    dotenv.config();
    
    // Whitelisted environment variables to include in the build
    const include = ['SUPABASE_URL', 'SUPABASE_KEY'];
    
    // Replace process.env.X with actual values during build
    build.onResolve({ filter: /^process\.env\./ }, args => {
      const envVar = args.path.substring('process.env.'.length);
      if (include.includes(envVar)) {
        return {
          path: args.path,
          namespace: 'env-ns',
        };
      }
      return null;
    });

    build.onLoad({ filter: /.*/, namespace: 'env-ns' }, args => {
      const envVar = args.path.substring('process.env.'.length);
      const value = process.env[envVar] || '';
      return {
        contents: JSON.stringify(value),
        loader: 'json',
      };
    });
  },
});

async function build() {
  console.log('Building MCP server...');
  
  try {
    await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      platform: 'node',
      target: 'node16',
      outfile: 'dist/index.js',
      format: 'esm',
      minify: true,
      plugins: [
        nodeExternalsPlugin(),
        dotenvPlugin()
      ]
    });
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Run the build
build(); 