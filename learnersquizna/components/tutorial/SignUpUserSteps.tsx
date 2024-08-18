import Link from "next/link";
import Step from "./Step";
import {Snippet} from "@nextui-org/react";

export default function SignUpUserSteps() {
    return (
        <ol className="flex flex-col gap-2">
            <Step title="Login/ Create Account">
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
                <div className="flex flex-wrap gap-2">
                    <Snippet symbol="user" color="danger" size="sm">demo@gmail.com</Snippet>
                    <Snippet symbol="password" color="danger" size="sm">demo</Snippet>
                </div>
            </Step>
            <Step title="Take quiz">
                <p>
                    Choose a paper...And practice like no ones watching.
                </p>
            </Step>
        </ol>
    );
}
