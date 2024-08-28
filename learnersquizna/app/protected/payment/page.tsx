import AuthButton from "@/components/AuthButton";
import BackButton from "@/components/Payments/BackButton";
import {createClient} from "@/utils/supabase/server";
import {Footer} from "@/components/Footer";
import {redirect} from "next/navigation";
import PaymentCard from "@/components/questionPapers/PaymentCard";

export default async function ProtectedPage() {
    const supabase = createClient();
    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-0 md:gap-2 items-center relative">
            {/* Floating Back Button */}
            <BackButton destination="/protected/user"/>

            <div className="w-full">
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-10 md:h-14">
                    <div className="w-full max-w-4xl flex justify-between p-3 items-center text-sm">
                        <p>v1.0</p>
                    </div>
                    <div className="w-full max-w-4xl flex justify-between p-3 items-center text-sm">
                        <a></a>
                        <AuthButton/>
                    </div>
                </nav>
            </div>

            <div className="flex-1 flex flex-col gap-2 max-w-4xl px-3">
                <main className="flex-1 flex flex-col gap-6">
                    <h2 className="font-bold text-4xl mb-4 text-center">How To Buy More Tests</h2>

                    {/* Payment Instructions */}
                    <PaymentCard
                        title="FNB Pay2Cell"
                        steps={[
                            "Pay2Cell to +081 7173244.",
                            "Enter the reference as your email address that you signed up with.",
                        ]}
                    />

                    <PaymentCard
                        title="Ewallet"
                        steps={[
                            "Send the payment to the number: +081 7173244.",
                            "After sending, send an SMS to the same number notifying me of your payment.",
                        ]}
                    />

                    <PaymentCard
                        title="BlueWallet"
                        steps={[
                            "Log in to your BlueWallet app.",
                            "Send the payment to the provided address or number.",
                            "After sending, send an SMS to +081 7173244 notifying me of your payment.",
                        ]}
                    />

                    <PaymentCard
                        title="EasyWallet"
                        steps={[
                            "Log in to your EasyWallet app.",
                            "Send the payment to the provided address or number.",
                            "After sending, send an SMS to +081 7173244 notifying me of your payment.",
                        ]}
                    />
                </main>
            </div>

            <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
                <Footer/>
            </footer>
        </div>
    );
}
