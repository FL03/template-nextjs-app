import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const res = NextResponse.json({ ok: true });
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    res.cookies.set("subscription_status", "inactive", {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  }
  const { data, error } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();
  if (error) {
    console.error("Error fetching subscription status:", error);
    res.cookies.set("subscription_status", "inactive", {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  }
  
  const status = data.subscription_status;

  res.cookies.set("subscription_status", status, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}
