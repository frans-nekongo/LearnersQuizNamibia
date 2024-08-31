import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import ThemeSwitch from "@/components/NextUI/Themeswitcher";

export default async function AuthButton() {
    const supabase = createClient();

    // Get the currently logged-in user
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError || !userData.user) {
        console.error('Error fetching user data:', authError);
        return (
            <div className="flex items-center gap-4">
                <Link
                    href="/login"
                    className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
                >
                    Login/Sign-Up
                </Link>
                <ThemeSwitch />
            </div>
        );
    }

    const userEmail = userData.user.email;

    // Fetch the user's name from the `user` table using the email
    const { data: userInfo, error: userError } = await supabase
        .from('user')
        .select('Name_user')
        .eq('email_user', userEmail)
        .single();

    if (userError) {
        console.error('Error fetching user info:', userError);
    }

    const signOut = async () => {
        "use server";
        const supabase = createClient();
        await supabase.auth.signOut();
        return redirect("/login");
    };

    const handleSubmit = async () => {
        "use server";
        return redirect("/protected/payment");
    };

    return userData.user ? (
        <div className="flex flex-row items-center gap-4 flex-nowrap">
            <p className="whitespace-nowrap">
                Hey, {userInfo?.Name_user || userEmail}!
            </p>
            <form action={handleSubmit}>
                <button
                    type="submit"
                    className="py-2 px-4 text-[#CB011F] dark:text-yellow-400 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover whitespace-nowrap">
                    Buy More Tests!
                </button>
            </form>
            <form action={signOut}>
                <button
                    type="submit"
                    className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover whitespace-nowrap">
                    Logout
                </button>
            </form>
            <ThemeSwitch />
        </div>
    ) : (
        <div className="flex items-center gap-4">
            <Link
                href="/login"
                className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
            >
                Login
            </Link>
            <ThemeSwitch />
        </div>
    );
}
