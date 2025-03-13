import { supabase } from '../config/supabase.js';
import crypto from 'crypto';

export class AdvertiserService {
  /**
   * Get advertiser context by ID
   * This will be used after API key validation
   */
  static async getAdvertiserContext(advertiserId) {
    try {
      const { data, error } = await supabase
        .from('advertisers')
        .select('id, user_id, profile_id, account_name, marketplace, account_type, metadata')
        .eq('id', advertiserId)
        .single();

      if (error || !data) {
        console.error('Error fetching advertiser:', error);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        profileId: data.profile_id,
        accountName: data.account_name,
        marketplace: data.marketplace,
        accountType: data.account_type,
        metadata: data.metadata
      };
    } catch (error) {
      console.error('Unexpected error fetching advertiser:', error);
      return null;
    }
  }

  /**
   * Update the last_used_at timestamp for an API key
   */
  static async updateApiKeyUsage(apiKey) {
    try {
      // Try updating key column
      const { error } = await supabase
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('key', apiKey);

      if (error) {
        // Try updating key_value column
        await supabase
          .from('api_keys')
          .update({ last_used: new Date().toISOString() })
          .eq('key_value', apiKey);
      }
    } catch (error) {
      console.error('Error updating API key usage:', error);
    }
  }

  /**
   * Create a new API key for an advertiser
   */
  static async createApiKey(advertiserId) {
    try {
      const apiKey = crypto.randomUUID();
      
      const { error } = await supabase
        .from('api_keys')
        .insert({
          key: apiKey,
          advertiser_id: advertiserId,
          active: true
        });

      if (error) {
        console.error('Error creating API key:', error);
        return null;
      }

      return apiKey;
    } catch (error) {
      console.error('Unexpected error creating API key:', error);
      return null;
    }
  }

  /**
   * Get basic info for all advertisers (for debugging/admin purposes)
   */
  static async getAllAdvertisers() {
    try {
      const { data, error } = await supabase
        .from('advertisers')
        .select('id, account_name');

      if (error) {
        console.error('Error fetching advertisers:', error);
        return null;
      }

      return data.map(adv => ({
        id: adv.id,
        accountName: adv.account_name
      }));
    } catch (error) {
      console.error('Unexpected error fetching advertisers:', error);
      return null;
    }
  }
} 