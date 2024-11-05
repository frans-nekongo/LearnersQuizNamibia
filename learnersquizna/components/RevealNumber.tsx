// components/RevealNumber.js
"use client";

import { useState } from "react";

export default function RevealNumber() {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <div className="w-full flex flex-col items-center gap-4 mt-8 bg-btn-background p-4 rounded-lg ">
            {isRevealed ? (
                <p className="text-center dark:text-white text-black transition-opacity duration-500 ease-in-out opacity-100">
                    Send to <strong>+081 7173244</strong>.
                </p>
            ) : (
                <button
                    onClick={() => setIsRevealed(true)}
                    className="text-gray-700 bg-gray-200 px-4 py-2 rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                >
                    Don't Press Me!
                </button>
            )}
        </div>
    );
}
