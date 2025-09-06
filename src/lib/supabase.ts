import { createClient } from "@supabase/supabase-js";

// Environment variables validation
const validateEnvVars = () => {
  const errors: string[] = [];

  // In Vite, environment variables are accessed via import.meta.env
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl === "YOUR_SUPABASE_URL") {
    errors.push(
      "❌ VITE_SUPABASE_URL is missing or not set properly in .env.local"
    );
  }

  if (!supabaseAnonKey || supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY") {
    errors.push(
      "❌ VITE_SUPABASE_ANON_KEY is missing or not set properly in .env.local"
    );
  }

  if (errors.length > 0) {
    console.error("\n🚨 SUPABASE CONFIGURATION ERRORS:");
    console.error("=====================================");
    errors.forEach((error) => console.error(error));
    console.error("\n📝 To fix this:");
    console.error("1. Create/update .env.local file in your project root");
    console.error("2. Add your Supabase credentials:");
    console.error("   VITE_SUPABASE_URL=https://your-project.supabase.co");
    console.error("   VITE_SUPABASE_ANON_KEY=your-anon-key-here");
    console.error("3. Restart the dev server (npm run dev)");
    console.error("=====================================\n");

    // Return placeholder values to prevent app crash
    return {
      url: "https://placeholder.supabase.co",
      key: "placeholder-key",
    };
  }

  console.log("✅ Supabase environment variables are properly configured");
  return {
    url: supabaseUrl,
    key: supabaseAnonKey,
  };
};

const { url: supabaseUrl, key: supabaseAnonKey } = validateEnvVars();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Student {
  id?: number;
  sr_no?: number;
  student_name: string;
  father_name: string;
  dob?: string;
  b_form_no?: string;
  phone_no?: string;
  father_id_no?: string;
  class: string;
  ad_no: string;
  section: "boys" | "girls";
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}
