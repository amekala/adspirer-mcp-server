export interface Database {
  public: {
    Tables: {
      api_keys: {
        Row: {
          id: string;
          key: string;
          advertiser_id: string;
          active: boolean;
          created_at: string;
          last_used_at: string | null;
        };
        Insert: {
          id?: string;
          key: string;
          advertiser_id: string;
          active?: boolean;
          created_at?: string;
          last_used_at?: string | null;
        };
        Update: {
          id?: string;
          key?: string;
          advertiser_id?: string;
          active?: boolean;
          created_at?: string;
          last_used_at?: string | null;
        };
      };
      advertisers: {
        Row: {
          id: string;
          user_id: string;
          profile_id: string;
          account_name: string;
          marketplace: string;
          account_type: string;
          connected_since: string;
          metadata: {
            timezone: string;
            accountInfo: {
              id: string;
              name: string;
              type: string;
              validPaymentMethod: boolean;
              marketplaceStringId: string;
            };
            countryCode: string;
            currencyCode: string;
          };
        };
        Insert: {
          id?: string;
          user_id: string;
          profile_id: string;
          account_name: string;
          marketplace: string;
          account_type: string;
          connected_since?: string;
          metadata?: {
            timezone: string;
            accountInfo: {
              id: string;
              name: string;
              type: string;
              validPaymentMethod: boolean;
              marketplaceStringId: string;
            };
            countryCode: string;
            currencyCode: string;
          };
        };
        Update: {
          id?: string;
          user_id?: string;
          profile_id?: string;
          account_name?: string;
          marketplace?: string;
          account_type?: string;
          connected_since?: string;
          metadata?: {
            timezone: string;
            accountInfo: {
              id: string;
              name: string;
              type: string;
              validPaymentMethod: boolean;
              marketplaceStringId: string;
            };
            countryCode: string;
            currencyCode: string;
          };
        };
      };
      amazon_tokens: {
        Row: {
          id: string;
          user_id: string;
          access_token: string;
          refresh_token: string;
          token_type: string;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          access_token: string;
          refresh_token: string;
          token_type: string;
          expires_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          access_token?: string;
          refresh_token?: string;
          token_type?: string;
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          advertiser_id: string;
          campaign_id: string;
          name: string;
          state: string;
          type: string;
          targeting_type: string;
          start_date: string;
          end_date: string | null;
          budget: number;
          budget_type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          advertiser_id: string;
          campaign_id: string;
          name: string;
          state: string;
          type: string;
          targeting_type: string;
          start_date: string;
          end_date?: string | null;
          budget: number;
          budget_type: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          advertiser_id?: string;
          campaign_id?: string;
          name?: string;
          state?: string;
          type?: string;
          targeting_type?: string;
          start_date?: string;
          end_date?: string | null;
          budget?: number;
          budget_type?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      campaign_metrics: {
        Row: {
          id: string;
          campaign_id: string;
          date: string;
          impressions: number;
          clicks: number;
          spend: number;
          sales: number;
          units_sold: number;
          acos: number;
          roas: number;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          date: string;
          impressions: number;
          clicks: number;
          spend: number;
          sales: number;
          units_sold: number;
          acos: number;
          roas: number;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          date?: string;
          impressions?: number;
          clicks?: number;
          spend?: number;
          sales?: number;
          units_sold?: number;
          acos?: number;
          roas?: number;
          created_at?: string;
          updated_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 