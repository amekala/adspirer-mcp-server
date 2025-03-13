# Developer Guide for Adspirer MCP Server

This guide explains how to securely develop, build, and distribute the Amazon Advertising MCP Server.

## Secure Credential Handling

This project uses a build-time approach to securely embed Supabase credentials. This means:

1. Credentials are never stored in the source code
2. They are injected at build time from environment variables
3. Users of the package never need to provide or know about these credentials

## Development Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and add your Supabase credentials:
   ```
   cp .env.example .env
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Run in development mode:
   ```
   npm run dev
   ```

## Build Process

The build process compiles the source and embeds Supabase credentials:

```
npm run build
```

This uses esbuild with the dotenv plugin to:
1. Bundle the code
2. Inject environment variables directly into the bundle
3. Produce a distributable package that doesn't require separate credential configuration

## CI/CD Integration

For secure CI/CD integration:

1. Store your Supabase credentials as secrets in your CI/CD platform
2. The GitHub Actions workflow is configured to fetch these secrets at build time
3. The workflow builds and publishes the package securely

Example GitHub Actions secrets to configure:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase service role key 
- `NPM_TOKEN`: Your npm publishing token

## Security Best Practices

1. **Never commit credentials** - The `.gitignore` is set up to exclude `.env` files
2. **Use environment-specific builds** - Test builds shouldn't use production credentials
3. **Rotate credentials** - Periodically update the Supabase credentials and rebuild
4. **Limit access** - Use Supabase Row Level Security to restrict access by API key

## Distribution

The package is distributed via npm. End users only need to:

1. Install the package: `npm install -g adspirer-mcp-server`
2. Configure Claude Desktop with their Amazon Advertising API key: `adspirer-mcp config`
3. Start using it: `adspirer-mcp start`

Users never see or interact with the Supabase credentials.

## Adding New Supabase Values

If you need to include additional Supabase environment variables:

1. Add them to `.env.example`
2. Add them to the `include` array in `build.js`
3. Add them as secrets in your CI/CD environment 