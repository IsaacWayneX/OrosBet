"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Optional sign in</h1>
        <p className="mt-2 text-sm text-slate-400">Soft auth means users can browse first and sign in later.</p>
        <div className="mt-5 space-y-3">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" type="email" />
          <Button
            className="w-full"
            onClick={async () => {
              const result = await supabase.auth.signInWithOtp({ email });
              setMessage(result.error ? result.error.message : "Magic link requested. Hook up real Supabase env vars to enable it.");
            }}
          >
            Send magic link
          </Button>
          {message ? <p className="text-sm text-slate-300">{message}</p> : null}
        </div>
      </Card>
    </div>
  );
}
