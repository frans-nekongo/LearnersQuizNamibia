// app/api/auth/signout/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
    const supabase = createClient();
    await supabase.auth.signOut();
    return NextResponse.redirect("/login");
}
