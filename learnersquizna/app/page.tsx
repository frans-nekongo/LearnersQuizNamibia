import {redirect} from "next/navigation";
import DeployButton from "../components/DeployButton";
import AuthButton from "../components/AuthButton";
import {createClient} from "@/utils/supabase/server";
import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import Header from "@/components/Header";
import {Footer} from "@/components/Footer";
import {Toast} from "@/components/Toast";

export default async function Index() {
    const supabase = createClient();

    const {
        data: {user},
    } = await supabase.auth.getUser();

    // If the user is already logged in, redirect them to the protected route
    if (user) {
        return redirect("/protected");
    }

    const canInitSupabaseClient = () => {
        // This function is just for the interactive tutorial.
        // Feel free to remove it once you have Supabase connected.
        try {
            createClient();
            return true;
        } catch (e) {
            return false;
        }
    };

    const isSupabaseConnected = canInitSupabaseClient();

    return (
        <div className="flex-1 w-full flex flex-col gap-2 items-center">
            <Toast/>
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
                    <p>v1.0</p>
                </div>
                <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
                    <a></a>
                    {isSupabaseConnected && <AuthButton/>}
                </div>
            </nav>

            <div className="flex-1 flex flex-col gap-2 max-w-4xl px-3">
                <Header/>
                <main className="flex-1 flex flex-col gap-1">
                    <h2 className="font-bold text-2xl mb-4">Next steps</h2>
                    {isSupabaseConnected && <SignUpUserSteps/>}
                </main>
            </div>

            <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
                <Footer/>
            </footer>
        </div>
    );
}
