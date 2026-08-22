import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/constants";

export type SoftUser = {
  id: string;
  email?: string;
} | null;

export function createSupabaseBrowserClient() {
  return {
    auth: {
      async getUser(): Promise<{ data: { user: SoftUser } }> {
        return { data: { user: null } };
      },
      async signInWithOtp({ email }: { email: string }) {
        return {
          data: { email, provider: "email" },
          error: !SUPABASE_URL || !SUPABASE_ANON_KEY ? new Error("Supabase env vars are missing") : null,
        };
      },
      async signOut() {
        return { error: null };
      },
    },
  };
}
