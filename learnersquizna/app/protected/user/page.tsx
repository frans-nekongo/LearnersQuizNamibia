import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import {createClient} from "@/utils/supabase/server";
import FetchDataSteps from "@/components/tutorial/FetchDataSteps";
import Header from "@/components/Header";
import {redirect} from "next/navigation";
import {Footer} from "@/components/Footer";
import {Questioncard} from "@/components/Questioncard";
import {Button} from "@nextui-org/react";
import {QuestionView} from "@/components/QuestionView";
import {Toast} from "@/components/Toast";
import {TestInfo} from "@/components/TestInfo";
import {useTestsLeft} from "@/components/useTestsLeft";
import {useSyncDecrementOnLoad} from "@/components/DecrementTests";
import SyncDecrement from "@/components/SyncDecrement";


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
            <SyncDecrement />

            <div className="w-full">
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
                <Header/>
                <main className="flex-1 flex flex-col gap-6">

                    <QuestionView/>

                </main>
            </div>

            <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
                <Footer/>
            </footer>
        </div>
    );
}
