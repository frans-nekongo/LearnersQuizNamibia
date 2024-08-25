import AuthButton from "@/components/AuthButton";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {Footer} from "@/components/Footer";
import {Toast} from "@/components/Toast";


export default async function ProtectedPage() {
    const supabase = createClient();

    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-0 md:gap-2 items-center">
            {/*<Toast/>*/}
            <div className="w-full">
                {/*<div className="py-6 font-bold bg-purple-950 text-center">*/}
                {/*  This is a protected page that you can only see as an authenticated*/}
                {/*  user*/}
                {/*</div>*/}
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-10 md:h-14">
                    <div className="w-full max-w-4xl flex justify-between p-3 items-center text-sm">
                        <p>v1.0</p>
                    </div>
                    <div className="w-full max-w-4xl flex justify-between p-3 items-center  text-sm">
                        <a></a>
                        <AuthButton/>
                    </div>
                </nav>
            </div>

            <div className="flex-1 flex flex-col gap-2 max-w-4xl px-3">
                <main className="flex-1 flex flex-col gap-6">
                    <h2 className="font-bold text-4xl mb-4 text-center">How To Buy More Tests</h2>
                    {/*<QuestionView/>*/}
                    {/*<Questioncard/>*/}
                    {/*<QuestionsGet/>*/}
                    {/*<FetchDataSteps/>*/}
                </main>
            </div>

            <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
                <Footer/>
            </footer>
        </div>
    );
}
