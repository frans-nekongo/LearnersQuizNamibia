'use client';

import { FiSun, FiMoon } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleThemeChange = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button onClick={handleThemeChange} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
      {resolvedTheme === 'dark' ? <FiSun size={24} /> : <FiMoon size={24} />}
    </button>
  );
}
