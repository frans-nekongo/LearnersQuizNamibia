import Link from "next/link";
import Step from "./Step";
import { Snippet } from "@nextui-org/react";

export default function SignUpUserSteps() {
    return (
        <ol className="flex flex-col gap-6">
            <Step title="🚪 Login/Create Account">
                <p className="transform-gpu transition-transform hover:scale-105">
                    Head over to the{" "}
                    <Link
                        href="/login"
                        className="font-bold hover:underline text-primary"
                    >
                        Login
                    </Link>{" "}
                    page and sign up.:
                </p>
                {/*<div className="flex flex-wrap gap-2 mt-2">*/}
                {/*    <Snippet symbol="👤" color="primary" size="sm">*/}
                {/*        demo@gmail.com*/}
                {/*    </Snippet>*/}
                {/*    <Snippet symbol="🔒" color="primary" size="sm">*/}
                {/*        demo*/}
                {/*    </Snippet>*/}
                {/*</div>*/}
            </Step>
            <Step title="🛞 Test Your Skills">
                <p className="transform-gpu transition-transform hover:scale-105">
                    Choose your vehicle code 🚗, select Test A, B, or C, and practice like no one is watching!
                </p>
            </Step>
            <Step title="💡 Get Feedback">
                <p className="transform-gpu transition-transform hover:scale-105">
                    📊 Get live feedback on your mistakes ❌, your score 🏆, and areas for improvement 🔍.
                </p>
            </Step>
        </ol>
    );
}
