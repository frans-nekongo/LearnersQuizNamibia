// components/SyncDecrement.tsx
"use client";


import {useSyncDecrementOnLoad} from "@/components/DecrementTests";

const SyncDecrement = () => {
    useSyncDecrementOnLoad();

    return null; // This component doesn’t need to render anything
};

export default SyncDecrement;
