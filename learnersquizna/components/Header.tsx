import NextLogo from "./NextLogo";
import SupabaseLogo from "./SupabaseLogo";
import React from "react";
import {Image} from "@nextui-org/react";
import NextImage from "next/image";

export default function Header() {

    const url = "https://isqkzbwoiunnqsltbfpa.supabase.co/storage/v1/object/public/WebsiteLogo/logo_learnersquiz.png";

    return (
        <div className="flex flex-col gap-5 items-center">
            {/*<div className="flex gap-8 justify-center items-center">*/}
            {/*</div>*/}
            <img
                src={url}
            />

            <h1 className="sr-only">Namibian Learners licence Test</h1>

            <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
                Master your
            </p>
            <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center font-bold hover:underline">
                Namibian Learners Test.
            </p>

            <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8"/>
        </div>
    );
}
