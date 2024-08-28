"use client"
import { useState } from 'react';

export function Footer() {
    const [isTooltipVisible, setTooltipVisible] = useState(false);

    return (
        <div className="container mx-auto flex flex-col items-center">
            <p className="text-sm md:text-base">
                Developed and deployed by{' '}
                <a
                    href="https://www.frans-nekongo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-red-800 hover:text-red-800 hover:underline transition duration-200"
                >
                    RXD
                </a>
            </p>

            <p className="mt-2 text-xs md:text-sm text-gray-400">
                Inspiré par{' '}
                <span
                    onMouseEnter={() => setTooltipVisible(true)}
                    onMouseLeave={() => setTooltipVisible(false)}
                    className="relative font-bold text-blue-600 hover:text-blue-800 transition duration-200 cursor-pointer"
                >
                    NINO
                    {isTooltipVisible && (
                        <div
                            className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-3 w-64 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10"
                            onMouseEnter={() => setTooltipVisible(true)}
                            onMouseLeave={() => setTooltipVisible(false)}
                        >
                            RIP A great friend, we were supposed to get our learners, inspired me to make this because I struggle with reading and taking tests
                        </div>
                    )}
                </span>{' '}
                | Powered by Nokia 3320 | © {new Date().getFullYear()} RXD. All rights reserved.
            </p>
        </div>
    );
}
