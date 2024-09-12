import React from 'react';
import {BiGridAlt, BiListUl} from "react-icons/bi";
import {Button} from "@nextui-org/react";

interface LayoutToggleProps {
    isGridLayout: boolean;        // Receive isGridLayout as a prop
    onLayoutChange: (isGridLayout: boolean) => void;
}

export default function LayoutToggle({isGridLayout, onLayoutChange}: LayoutToggleProps) {
    const handleToggle = () => {
        const newLayout = !isGridLayout;
        onLayoutChange(newLayout); // Notify parent component of the layout change
    };

    return (
        <div className="">
            <Button
                size="sm"
                onClick={handleToggle}
                className="px-6 py-3 bg-blue-500 text-white rounded-full flex items-center justify-center transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-600"
            >
                {isGridLayout ? (
                    <BiListUl className="mr-2 h-5 w-5"/>
                ) : (
                    <BiGridAlt className="mr-2 h-5 w-5"/>
                )}
            </Button>

        </div>
    );
}
