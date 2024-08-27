// components/BackButton.tsx
"use client"; // Ensure this is a client component

import { useRouter } from "next/navigation";

interface BackButtonProps {
    destination: string; // Route to navigate to when clicked
}

const BackButton: React.FC<BackButtonProps> = ({ destination }) => {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push(destination)}
            className="fixed bottom-8 right-8 bg-[#CB011F] text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition duration-300 ease-in-out z-50"
            aria-label="Back"
        >
            ← Back
        </button>
    );
};

export default BackButton;
