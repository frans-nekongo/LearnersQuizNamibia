import AuthButton from "@/components/AuthButton";
import BackButton from "@/components/Payments/BackButton";
import {createClient} from "@/utils/supabase/server";
import {Footer} from "@/components/Footer";
import {redirect} from "next/navigation";
import PaymentCard from "@/components/questionPapers/PaymentCard";
import PricingCard from "@/components/Payments/PricingCard";

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
                <main className=" flex-1 flex flex-col gap-6">
                    <div className="bg-btn-background flex flex-col items-center gap-6 p-6 rounded-lg max-w-4xl mx-auto">
                        <h2 className="dark:text-yellow-400 font-extrabold text-4xl mb-4 text-center text-blue-600">
                            Support Me with a Coffee
                        </h2>
                        <p className="text-center text-lg dark:text-white text-gray-700 mb-8">
                            Enjoying my work? <br/>Treat this Uni Student to a coffee and keep the creativity flowing!
                        </p>

                        {/* Pricing Section */}
                        <div className="flex flex-row gap-8 justify-center">
                            <div
                                className="dark:bg-black flex flex-col p-6 bg-white rounded-lg shadow-md w-64 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                                <h3 className="dark:text-white text-xl font-bold mb-2">☕ Large Coffee</h3>
                                <p className="dark:text-white text-gray-700 mb-4">N$40</p>
                                <p className="dark:text-white text-gray-600 flex-grow">Support with a large coffee</p>
                            </div>

                            <div
                                className="dark:bg-black flex flex-col p-6 bg-white rounded-lg shadow-md w-64 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                                <h3 className="dark:text-white text-xl font-bold mb-2">☕ Regular Coffee</h3>
                                <p className="dark:text-white text-gray-700 mb-4">N$25</p>
                                <p className="dark:text-white text-gray-600 flex-grow">Support with a regular coffee</p>
                            </div>
                        </div>


                        {/* Single Payment Instruction */}
                        <div className="w-full flex flex-col items-center gap-6 mt-8 bg-white p-4 rounded-lg shadow-md">
                            <p className="text-center text-gray-700">
                                Send to <strong>+081 7173244</strong>. <br/>
                            </p>
                        </div>

                        {/* Footer */}
                        <footer className="text-center text-gray-500 mt-10">
                            Thank you for your support! ❤️
                        </footer>
                    </div>

                </main>
            </div>

            <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
                <Footer/>
            </footer>
        </div>
    );
}
