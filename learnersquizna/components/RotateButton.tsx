// components/RotateButton.tsx
"use client"
import React from 'react';

const RotateButton: React.FC = () => {
    return (
        <div className="fixed bottom-4 right-4 md:hidden bg-blue-500 text-white p-2 rounded-full shadow-lg cursor-pointer" 
             onClick={() => alert('Please rotate your device to landscape mode')}>
            Rotate
        </div>
    );
};

export default RotateButton;
