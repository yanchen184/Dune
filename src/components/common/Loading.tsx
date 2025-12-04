import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = '載入中...' }: LoadingProps) {
  const wormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wormRef.current) {
      gsap.to(wormRef.current, {
        x: '100%',
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-32 h-2 bg-dune-dark rounded-full overflow-hidden mb-4">
        <div
          ref={wormRef}
          className="absolute left-0 top-0 w-8 h-2 bg-gradient-to-r from-dune-spice to-dune-sand rounded-full"
        />
      </div>
      <p className="text-dune-sand font-rajdhani text-lg">{message}</p>
    </div>
  );
}
