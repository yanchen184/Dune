import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

interface LoadingProps {
  message?: string;
}

/**
 * 沙丘主題載入動畫組件
 * Reason: AI 識別時提供視覺回饋，使用沙丘配色和科幻感設計
 */
export default function Loading({ message = '載入中...' }: LoadingProps) {
  const particlesRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 粒子飄動動畫（模擬香料粉塵）
    if (particlesRef.current) {
      const particles = particlesRef.current.querySelectorAll('.particle');
      particles.forEach((particle, index) => {
        gsap.to(particle, {
          y: '-=30',
          x: `${Math.random() * 20 - 10}px`,
          opacity: 0,
          duration: 2 + Math.random() * 2,
          delay: index * 0.2,
          repeat: -1,
          ease: 'power1.inOut',
        });
      });
    }

    // 掃描線動畫
    if (scanLineRef.current) {
      gsap.to(scanLineRef.current, {
        scaleX: 1,
        duration: 1.5,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 relative">
      {/* 外圈脈動光環 */}
      <motion.div
        className="absolute w-48 h-48 rounded-full border-2 border-dune-spice/30"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 中圈脈動光環 */}
      <motion.div
        className="absolute w-36 h-36 rounded-full border-2 border-dune-sand/40"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      {/* 核心發光圓 */}
      <motion.div
        className="relative w-24 h-24 rounded-full bg-gradient-to-br from-dune-spice via-dune-sand to-dune-spice flex items-center justify-center shadow-2xl"
        animate={{
          boxShadow: [
            '0 0 20px rgba(255, 107, 53, 0.5)',
            '0 0 40px rgba(255, 107, 53, 0.8)',
            '0 0 20px rgba(255, 107, 53, 0.5)',
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* AI 圖標 */}
        <motion.div
          className="text-4xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          🤖
        </motion.div>

        {/* 旋轉軌道線 */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-dune-deep/50 border-t-dune-sand"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>

      {/* 香料粒子效果 */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 rounded-full bg-dune-spice"
            style={{
              left: `${50 + Math.cos((i * Math.PI * 2) / 12) * 40}%`,
              top: `${50 + Math.sin((i * Math.PI * 2) / 12) * 40}%`,
              boxShadow: '0 0 8px rgba(255, 107, 53, 0.8)',
            }}
          />
        ))}
      </div>

      {/* 進度條容器 */}
      <div className="relative w-80 mt-8 mb-6">
        {/* 背景軌道 */}
        <div className="h-3 bg-dune-deep rounded-full border border-dune-sand/30 overflow-hidden">
          {/* 掃描線 */}
          <div
            ref={scanLineRef}
            className="h-full bg-gradient-to-r from-transparent via-dune-spice to-transparent origin-left"
            style={{ transformOrigin: 'left' }}
          />
        </div>

        {/* 進度軌跡光效 */}
        <motion.div
          className="absolute top-0 left-0 h-3 bg-gradient-to-r from-dune-spice/60 via-dune-sand/80 to-dune-spice/60 rounded-full"
          animate={{
            width: ['0%', '100%', '0%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* 載入文字 */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-dune-sand font-orbitron text-xl font-bold tracking-wider mb-2">
          {message}
        </p>
        <motion.p
          className="text-dune-spice font-rajdhani text-sm"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          GPT-4o Vision 分析中
        </motion.p>
      </motion.div>

      {/* 底部裝飾線 */}
      <div className="mt-6 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-dune-spice"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
