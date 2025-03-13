import { supabase } from '../config/supabase.js';

export interface AdvertiserContext {
  id: string;
  userId: string;
  accountName: string;
  marketplace: string;
  accountType: string;
  profileId: string;
  metadata?: {
    countryCode?: string;
    currencyCode?: string;
    [key: string]: any;
  };
}

export class AdvertiserService {
  /**
   * Get advertiser context by ID
   * This will be used after API key validation
   */
  static async getAdvertiserContext(advertiserId: string): Promise<AdvertiserContext | null> {
    try {
      const { data, error } = await supabase
        .from('advertisers')
        .select('*')
        .eq('id', advertiserId)
        .single();

      if (error) {
        console.error('Error fetching advertiser:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        accountName: data.account_name,
        marketplace: data.marketplace,
        accountType: data.account_type,
        profileId: data.profile_id,
        metadata: data.metadata
      };
    } catch (error) {
      console.error('Error in getAdvertiserContext:', error);
      return null;
    }
  }

  /**
   * Update the last_used_at timestamp for an API key
   */
  static async updateApiKeyUsage(apiKey: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ last_used: new Date().toISOString() })
        .eq('key', apiKey);

      if (error) {
        console.error('Error updating API key usage:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateApiKeyUsage:', error);
      return false;
    }
  }

  /**
   * Create a new API key for an advertiser
   */
  static async createApiKey(advertiserId: string): Promise<string | null> {
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
  static async getAllAdvertisers(): Promise<{ id: string; accountName: string }[] | null> {
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

  static async listAdvertisers(): Promise<AdvertiserContext[]> {
    try {
      const { data, error } = await supabase
        .from('advertisers')
        .select('*')
        .order('account_name', { ascending: true });

      if (error) {
        console.error('Error listing advertisers:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map((adv: any) => ({
        id: adv.id,
        userId: adv.user_id,
        accountName: adv.account_name,
        marketplace: adv.marketplace,
        accountType: adv.account_type,
        profileId: adv.profile_id,
        metadata: adv.metadata
      }));
    } catch (error) {
      console.error('Error in listAdvertisers:', error);
      return [];
    }
  }
} 