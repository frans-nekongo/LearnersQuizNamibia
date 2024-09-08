"use client";

import { useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlineClose } from 'react-icons/ai'; // Import the close icon

export function Toast() {
  const hasToastBeenShown = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !hasToastBeenShown.current) {
        // Show the custom toast notification when the component is mounted
        toast((t) => (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            Rotate your phone for a better view!{' '}
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#0070f3',
                cursor: 'pointer',
                marginLeft: '8px',
                fontSize: '16px', // Adjust the font size as needed
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Dismiss"
            >
              <AiOutlineClose size={20} /> {/* Adjust the icon size as needed */}
            </button>
          </span>
        ));
        hasToastBeenShown.current = true; // Set ref to true to prevent multiple toasts
      }
    };

    // Initial check
    handleResize();

    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <Toaster />;
}
