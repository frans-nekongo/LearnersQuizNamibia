import Link from "next/link";
import Step from "./Step";
import { Snippet } from "@nextui-org/react";

export default function SignUpUserSteps() {
    return (
        <ol className="flex flex-col gap-6">
            <Step title="🚪 Login/Create Account">
                <p>
                    🚀 Head over to the{" "}
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
            <Step title="🛞 Start Your Test">
                <p>
                    🛣️ Choose your vehicle code, select Test A, B, or C, and hit the road with your test!
                </p>
            </Step>
        </ol>
    );
}
