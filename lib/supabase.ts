// Deprecated: Supabase client removed in favor of Firebase.
// This file now only holds shared types kept during migration.

export type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
};

export type PlayerProfile = {
  id: string;
  user_id: string;
  full_name: string;
  photo_url: string | null;
  modality: "futsal" | "salao" | "campo";
  position: string;
  provincia: string;
  municipio: string;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type Team = {
  id: string;
  name: string;
  description: string | null;
  captain_id: string;
  provincia: string;
  municipio: string;
  founded_at: string;
  created_at: string;
  updated_at: string;
};

export type Match = {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  match_type: "official" | "friendly";
  status: "pending" | "live" | "completed" | "cancelled";
  scheduled_at: string;
  location: string;
  provincia: string;
  municipio: string;
  created_at: string;
  updated_at: string;
};
