import NextLogo from "./NextLogo";
import SupabaseLogo from "./SupabaseLogo";

export default function Header() {
    return (
        <div className="flex flex-col gap-16 items-center">

            <h1 className="sr-only">Learners Test Namibia</h1>
            <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
                A faster way to master your Namibian Learners Test {" "}

            </p>
            <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8"/>
        </div>
    );
}
