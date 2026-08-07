import * as React from "react";

const Bad = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={56} height={56} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={28} cy={28} r={28} fill="#CA7600"/>
    <circle cx={28} cy={28} r={28} fill="#CA7600"/>
    <rect x={38} y={14} width={6} height={10} rx={3} fill="#6B3900"/>
    <rect x={12} y={14} width={6} height={10} rx={3} fill="#6B3900"/>
    <path d="M14 34C14 34 22.0963 28 28 28C33.9037 28 42 34 42 34" stroke="#6B3900" strokeWidth={4} strokeLinecap="round"/>
    </svg>
  );
};

export default Bad;
