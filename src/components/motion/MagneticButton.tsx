"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function MagneticButton({
  children,
  className,
  href,
  target,
  rel,
  onClick,
  type = "button",
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  }

  function onLeave() {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
  }

  const inner = href ? (
    <a href={href} target={target} rel={rel} className={className} onClick={onClick}>
      {children}
    </a>
  ) : (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );

  return (
    <motion.div
      ref={ref}
      className="inline-block will-change-transform transition-transform duration-200"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={reduce ? undefined : { scale: 0.98 }}
    >
      {inner}
    </motion.div>
  );
}
