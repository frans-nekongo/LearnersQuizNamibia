// loginActions.ts
"use server";

import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {headers} from "next/headers";

export async function handleSignIn(email: string, password: string) {
    const supabase = createClient();

    // Authenticate the user
    const {error} = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return {error: "Could not authenticate user"};
    }

    const adminEmail = process.env.ADMIN_EMAIL;

    // Check if the user is an admin
    if (email === adminEmail) {
        return redirect("/protected/admin");
    }

    // Check if the user exists in the `user` table
    const {data: userData, error: userError} = await supabase
        .from("user")
        .select("email_user")
        .eq("email_user", email);

    if (userError) {
        return {error: "Error checking user in database"};
    }

    // If the user doesn't exist, indicate that we need to collect the user's name
    if (userData.length === 0) {
        return {needsName: true};
    }

    // Redirect to user dashboard if everything is fine
    return redirect("/protected/user");
}

export async function handleSignUp(email: string, password: string) {
    const supabase = createClient();

    // Sign up the user
    const {error: signUpError} = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${headers().get("origin")}/auth/callback`,
        },
    });

    if (signUpError) {
        return {error: "Could not sign up user"};
    }

    // Redirect to user dashboard if everything is fine
    return redirect("/protected/user");
}

export async function handleAddUser(email: string, userName: string) {
    const supabase = createClient();

    // Insert the new user with the provided name
    const {error: insertError} = await supabase
        .from("user")
        .insert([
            {
                email_user: email,
                Road_Sign_Attempts_Left: 0,
                Tests_Left: 3,
                Traffic_Rules_Attempts_Left: 0,
                Name_user: userName,
            },
        ]);

    if (insertError) {
        console.error("Insert Error:", insertError.message);
        return {error: "Error adding user to database"};
    }

    return redirect("/protected/user");
}
