import { createSupabaseBrowserClient } from "./client";

export function createSupabaseServerClient() {
  return createSupabaseBrowserClient();
}
