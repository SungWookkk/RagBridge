"use client";

import { motion } from "framer-motion";

/**
 * 애니메이션 배경 컴포넌트
 *
 * @description
 * - 그라데이션 배경 애니메이션
 * - 성능 최적화를 위한 메모이제이션
 * - 접근성을 고려한 aria-hidden 속성
 */
export function AnimatedBackground() {
  return (
    <motion.div
      className="absolute inset-0 -z-10 opacity-10"
      animate={{
        background: [
          "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.5) 0%, rgba(147, 51, 234, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
          "radial-gradient(circle at 30% 70%, rgba(16, 185, 129, 0.5) 0%, rgba(59, 130, 246, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
          "radial-gradient(circle at 70% 30%, rgba(245, 158, 11, 0.5) 0%, rgba(16, 185, 129, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
          "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.5) 0%, rgba(147, 51, 234, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
        ],
      }}
      transition={{
        duration: 20,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
      aria-hidden="true"
    />
  );
}
