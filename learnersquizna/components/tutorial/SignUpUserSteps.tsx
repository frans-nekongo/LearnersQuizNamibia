import Link from "next/link";
import Step from "./Step";
import {Snippet} from "@nextui-org/react";

export default function SignUpUserSteps() {
    return (
        <ol className="flex flex-col gap-6">
            <Step title="Sign up/ Create Account">
                <p>
                    Head over to the{" "}
                    <Link
                        href="/login"
                        className="font-bold hover:underline text-foreground/80"
                    >
                        Login
                    </Link>{" "}
                    page and sign up . It's okay if you dont have login details use mine!
                </p>
                <div className="flex flex-wrap gap-4">
                    <Snippet symbol="user" color="danger" size="sm">demo@gmail.com</Snippet>
                    <Snippet symbol="password" color="danger" size="sm">demo</Snippet>
                </div>
            </Step>
        </ol>
);
}
