"use client"
import React, { useEffect, useState } from "react";
import { Image } from "@nextui-org/react";

const imageUrl = "https://isqkzbwoiunnqsltbfpa.supabase.co/storage/v1/object/public/WebsiteLogo/logo_learnersquiz.png";
const localStorageKey = "headerLogo";

async function fetchImage(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
}

export default function Header() {
    const [imageSrc, setImageSrc] = useState<string>("");

    useEffect(() => {
        const checkImage = async () => {
            const localImage = localStorage.getItem(localStorageKey);
            if (localImage) {
                setImageSrc(localImage);
                return;
            }

            const newImage = await fetchImage(imageUrl);
            setImageSrc(newImage);
            localStorage.setItem(localStorageKey, newImage);
        };

        checkImage();
    }, []);

    return (
        <div className="z-50 flex flex-col gap-5 items-center">
            <Image
                className=""
                height={"350px"}
                src={imageSrc}
                alt="Namibian Learners Test Logo"
            />

            <h1 className="sr-only">Namibian Learners licence Test</h1>

            <p className="text-2xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
                Master your
            </p>
            <p className="text-2xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center font-bold hover:underline">
                Namibian Learners Test.
            </p>
            <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-1"/>
        </div>
    );
}
