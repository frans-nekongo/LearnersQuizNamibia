import Link from "next/link";
import Step from "./Step";

export default function SignUpUserSteps() {
    return (
        <ol className="flex flex-col gap-6">
            <Step title="Sign up/Login">
                <p>
                    Head over to the{" "}
                    <Link
                        href="/login"
                        className="font-bold hover:underline text-foreground/80"
                    >
                        Login
                    </Link>{" "}
                    page and sign up , It's okay if you dont want to make an account heres some credentials
                    <br/>
                    USER: demo@gmail.com
                    <br/>
                    PASSWORD: demo
                </p>
            </Step>
            <Step title="Select Test paper">
                <p>
                    select paper A, B or C
                </p>
            </Step>
        </ol>
    );
}
