"use client"; // Client component

import Link from "next/link";
import { useState } from "react";
import { SubmitButton } from "./submit-button";
import { handleSignIn, handleAddUser, handleSignUp } from "../auth/loginActions";
import { redirect } from "next/navigation";

export default function Login({ searchParams }: { searchParams: { message: string } }) {
    const [showNameInput, setShowNameInput] = useState(false); // State to show name input
    const [userName, setUserName] = useState(""); // State to store user name
    const [userEmail, setUserEmail] = useState(""); // Store email for later use

    const signIn = async (formData: FormData) => {
        const email = (formData.get("email") as string).toLowerCase(); // Convert email to lowercase
        const password = formData.get("password") as string;

        setUserEmail(email); // Store email

        const result = await handleSignIn(email, password);

        if (result?.error) {
            // Handle error
            return redirect(`/login?message=${result.error}`);
        }

        if (result?.needsName) {
            setShowNameInput(true); // Show name input if needed
        }
    };

    const signUp = async (formData: FormData) => {
        const email = (formData.get("email") as string).toLowerCase(); // Convert email to lowercase
        const password = formData.get("password") as string;

        setUserEmail(email); // Store email

        // Call handleSignUp with email and password
        const result = await handleSignUp(email, password);

        if (result?.error) {
            // Handle error and redirect with error message
            return redirect(`/login?message=${result.error}`);
        }

        // Redirect to login with a success message if sign-up is successful
        return redirect("/login?message=email verified Sign In");
    };

    const handleNameSubmit = async (formData: FormData) => {
        const name = formData.get("name") as string;

        if (!name) {
            return redirect("/login?message=Name is required");
        }

        const result = await handleAddUser(userEmail, name);

        if (result?.error) {
            return redirect(`/login?message=${result.error}`);
        }
    };

    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
            <Link
                href="/"
                className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                >
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
                {" "}
                Back
            </Link>

            <form className="flex-1 flex flex-col w-full justify-center gap-4 text-foreground">
                {!showNameInput && (
                    <>
                        <div className="flex flex-col gap-2">
                            <label className="text-md font-medium text-gray-700" htmlFor="email">
                                📧 Email
                            </label>
                            <input
                                className="rounded-md px-4 py-2 border border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all duration-300 mb-6"
                                name="email"
                                placeholder="you@example.com"
                                required
                                onChange={(e) => e.target.value = e.target.value.toLowerCase()} // Convert input to lowercase
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-md font-medium text-gray-700" htmlFor="password">
                                🔒 Password
                            </label>
                            <input
                                className="rounded-md px-4 py-2 border border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all duration-300 mb-6"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                minLength={6} // Notice the use of a number here
                            />
                        </div>

                        <SubmitButton
                            formAction={signIn}
                            className="bg-green-600 hover:bg-green-700 rounded-md px-4 py-2 text-white font-semibold transition-all duration-300 mb-2"
                            pendingText="Signing In..."
                        >
                            Sign In
                        </SubmitButton>

                        <SubmitButton
                            formAction={signUp}
                            className="border border-gray-300 hover:border-green-600 rounded-md px-4 py-2 text-gray-700 hover:text-green-600 font-semibold transition-all duration-300 mb-2"
                            pendingText="Signing Up..."
                        >
                            Sign Up
                        </SubmitButton>
                    </>
                )}

                {showNameInput && (
                    <div className="flex flex-col gap-2">
                        <label className="text-md font-medium text-gray-700" htmlFor="name">
                            👤 Name
                        </label>
                        <input
                            className="rounded-md px-4 py-2 border border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all duration-300 mb-6"
                            name="name"
                            placeholder="Your Name"
                            value={userName}
                            maxLength={6}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                        <SubmitButton
                            formAction={handleNameSubmit}
                            className="bg-green-600 hover:bg-green-700 rounded-md px-4 py-2 text-white font-semibold transition-all duration-300 mb-2"
                            pendingText="Submitting..."
                        >
                            Submit
                        </SubmitButton>
                    </div>
                )}

                {searchParams?.message && (
                    <p className="mt-4 p-4 bg-gray-100 text-gray-800 text-center rounded-md">
                        {searchParams.message}
                    </p>
                )}
            </form>
        </div>
    );
}
