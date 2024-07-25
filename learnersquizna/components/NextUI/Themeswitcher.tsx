"use client";

import {MoonIcon, SunIcon} from "@nextui-org/shared-icons";
import {Switch} from "@nextui-org/react";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";

export function Themeswitcher() {
    const [mounted, setMounted] = useState(false);
    const {theme, setTheme, resolvedTheme} = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleThemeChange = () => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <>
            {/*<p>The current theme is: {resolvedTheme}</p>*/}
            <Switch
                isSelected={resolvedTheme === 'dark'}
                size="md"
                color="success"
                startContent={<SunIcon />}
                endContent={<MoonIcon />}
                onChange={handleThemeChange}
            />
        </>
    );
}
