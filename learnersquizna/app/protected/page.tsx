import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import {createClient} from "@/utils/supabase/server";
import FetchDataSteps from "@/components/tutorial/FetchDataSteps";
import Header from "@/components/Header";
import {redirect} from "next/navigation";
import {Footer} from "@/components/Footer";
import {Questioncard} from "@/components/Questioncard";
import QuestionsGet from "@/components/QuestionsGet"
import {Button} from "@nextui-org/react";
import {QuestionView} from "@/components/QuestionView";

export default async function ProtectedPage() {
    const supabase = createClient();

    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <div className="w-full">
                {/*<div className="py-6 font-bold bg-purple-950 text-center">*/}
                {/*  This is a protected page that you can only see as an authenticated*/}
                {/*  user*/}
                {/*</div>*/}
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                    <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
                        <a></a>
                        <AuthButton/>
                    </div>
                </nav>
            </div>

            <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
                <Header/>
                <main className="flex-1 flex flex-col gap-6">
                    {/*<h2 className="font-bold text-4xl mb-4 text-center">Select Question paper</h2>*/}
                    <QuestionView/>
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
