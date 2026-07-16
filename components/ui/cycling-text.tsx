"use client";

import { useState, useEffect, useRef } from "react";

interface CyclingTextProps {
  words: string[];
  interval?: number;
  className?: string;
}

export function CyclingText({
  words,
  interval = 2800,
  className,
}: CyclingTextProps) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState<"idle" | "exit" | "enter">("idle");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clearTimers = () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };

    const intervalId = setInterval(() => {
      clearTimers();

      setAnimating("exit");

      const enterTimer = setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setAnimating("enter");
      }, 220);

      const idleTimer = setTimeout(() => {
        setAnimating("idle");
      }, 220 + 300);

      timersRef.current = [enterTimer, idleTimer];
    }, interval);

    return () => {
      clearInterval(intervalId);
      clearTimers();
    };
  }, []);

  return (
    <span
      className={[
        `inline-flex ${className}`,
        animating === "exit" ? "cycling-word--exit" : "",
        animating === "enter" ? "cycling-word--enter" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {words[index]}
    </span>
  );
}
