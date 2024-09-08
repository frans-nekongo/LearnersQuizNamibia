import React, {useState} from 'react';
import {BiGridAlt, BiListUl} from "react-icons/bi";
import {Button} from "@nextui-org/react";

interface LayoutToggleProps {
    onLayoutChange: (isGridLayout: boolean) => void;
}

export default function LayoutToggle({onLayoutChange}: LayoutToggleProps) {
    const [isGridLayout, setIsGridLayout] = useState(true);

    const handleToggle = () => {
        const newLayout = !isGridLayout;
        setIsGridLayout(newLayout);
        onLayoutChange(newLayout);
    };

    return (
        <div className="">
            <Button
                size={"sm"}
                onClick={handleToggle}
                className="px-6 py-3 bg-blue-500 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:bg-blue-600"
            >
                {isGridLayout ? (
                    <>
                        <BiListUl className="mr-2 h-5 w-5"/>
                    </>
                ) : (
                    <>
                        <BiGridAlt className="mr-2 h-5 w-5"/>
                    </>
                )}
            </Button>
        </div>
    );
}
