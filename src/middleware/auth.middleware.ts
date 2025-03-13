import { validateApiKey } from '../config/supabase.js';
import { AdvertiserService, AdvertiserContext } from '../services/advertiser.service.js';

export interface AuthContext extends AdvertiserContext {
  apiKey: string;
}

/**
 * Authenticate a connection based on provided API key
 * This will be used to validate connections to the MCP server
 */
export async function authenticate(apiKey: string): Promise<{ success: boolean; error?: string; session?: AdvertiserContext }> {
  try {
    if (!apiKey) {
      return { success: false, error: 'No API key provided' };
    }
    
    const validation = await validateApiKey(apiKey);
    if (!validation.valid || !validation.advertiserId) {
      return { success: false, error: validation.error || 'Invalid API key' };
    }
    
    const advertiser = await AdvertiserService.getAdvertiserContext(validation.advertiserId);
    if (!advertiser) {
      return { success: false, error: 'Failed to retrieve advertiser context' };
    }
    
    await AdvertiserService.updateApiKeyUsage(apiKey);
    
    return { 
      success: true,
      session: advertiser
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { 
      success: false, 
      error: 'Authentication failed due to an internal error' 
    };
  }
} 