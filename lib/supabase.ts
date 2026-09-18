import { createClient } from "@supabase/supabase-js";

// env value nikalta hai aur na milne par saaf error deta hai.
// Return type "string" hai, is liye TypeScript ko har jagah pakka pata hota hai.
function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `${name} nahi mila. .env.local mein daal kar app dobara chalayein: npx expo start -c`,
    );
  }
  return value;
}

const supabaseUrl = requireEnv(
  "EXPO_PUBLIC_SUPABASE_URL",
  process.env.EXPO_PUBLIC_SUPABASE_URL,
);
const supabaseAnonKey = requireEnv(
  "EXPO_PUBLIC_SUPABASE_KEY",
  process.env.EXPO_PUBLIC_SUPABASE_KEY,
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Clerk ka token use karne wala client
export function createClerkSupabaseClient(
  getToken: () => Promise<string | null>,
) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    async accessToken() {
      return getToken();
    },
  });
}
