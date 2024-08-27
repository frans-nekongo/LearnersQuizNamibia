// app/protected/payment/page.tsx
import AuthButton from "@/components/AuthButton";
import BackButton from "@/components/Payments/BackButton"; // Import the BackButton component
import { createClient } from "@/utils/supabase/server";
import { Footer } from "@/components/Footer";
import {redirect} from "next/navigation";

export default async function ProtectedPage() {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-0 md:gap-2 items-center relative">
            {/* Floating Back Button */}
            <BackButton destination="/protected/user" />

            <div className="w-full">
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-10 md:h-14">
                    <div className="w-full max-w-4xl flex justify-between p-3 items-center text-sm">
                        <p>v1.0</p>
                    </div>
                    <div className="w-full max-w-4xl flex justify-between p-3 items-center text-sm">
                        <a></a>
                        <AuthButton />
                    </div>
                </nav>
            </div>

            <div className="flex-1 flex flex-col gap-2 max-w-4xl px-3">
                <main className="flex-1 flex flex-col gap-6">
                    <h2 className="font-bold text-4xl mb-4 text-center">How To Buy More Tests</h2>
                    {/* Payment Instructions */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h3 className="text-2xl font-semibold mb-2">FNB Pay2Cell</h3>
                        <p className="mb-2">
                            To pay using FNB Pay2Cell, follow these steps:
                        </p>
                        <ul className="list-disc pl-5 mb-4">
                            <li>Pay2Cell to +081 7173244.</li>
                            <li>Enter the reference as your email address that you signed up with.</li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h3 className="text-2xl font-semibold mb-2">Ewallet</h3>
                        <p className="mb-2">
                            To pay using Ewallet, follow these steps:
                        </p>
                        <ul className="list-disc pl-5 mb-4">
                            <li>Send the payment to the number: +081 7173244.</li>
                            <li>After sending, send an SMS to the same number notifying me of your payment.</li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h3 className="text-2xl font-semibold mb-2">BlueWallet</h3>
                        <p className="mb-2">
                            To pay using BlueWallet, follow these steps:
                        </p>
                        <ul className="list-disc pl-5 mb-4">
                            <li>Log in to your BlueWallet app.</li>
                            <li>Send the payment to the provided address or number.</li>
                            <li>After sending, send an SMS to +081 7173244 notifying me of your payment.</li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h3 className="text-2xl font-semibold mb-2">EasyWallet</h3>
                        <p className="mb-2">
                            To pay using EasyWallet, follow these steps:
                        </p>
                        <ul className="list-disc pl-5 mb-4">
                            <li>Log in to your EasyWallet app.</li>
                            <li>Send the payment to the provided address or number.</li>
                            <li>After sending, send an SMS to +081 7173244 notifying me of your payment.</li>
                        </ul>
                    </div>
                </main>
            </div>

            <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
                <Footer />
            </footer>
        </div>
    );
}

async function handleSubmit() {
    "use server"; // Mark this function as a server-side action
    return redirect("/protected/payment");
}
