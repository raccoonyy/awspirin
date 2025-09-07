import { useState, useEffect } from 'react';

export type LayoutMode = 'horizontal' | 'vertical';

export function useResponsiveLayout(
  mode: 'horizontal' | 'vertical' | 'responsive' = 'responsive',
  breakpoint: number = 768,
): LayoutMode {
  const [layout, setLayout] = useState<LayoutMode>(() => {
    if (mode !== 'responsive') return mode;

    if (typeof window !== 'undefined') {
      return window.innerWidth >= breakpoint ? 'horizontal' : 'vertical';
    }
    return 'horizontal';
  });

  useEffect(() => {
    if (mode !== 'responsive') {
      setLayout(mode);
      return;
    }

    const handleResize = () => {
      const newLayout = window.innerWidth >= breakpoint ? 'horizontal' : 'vertical';
      setLayout(newLayout);
    };

    handleResize();

    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
    };
  }, [mode, breakpoint]);

  return layout;
}
