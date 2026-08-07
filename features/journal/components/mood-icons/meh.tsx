import * as React from "react";

const Meh = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={56} height={56} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={28} cy={28} r={28} fill="#9E714A"/>
    <circle cx={28} cy={28} r={28} fill="#9E714A"/>
    <rect x={38} y={14} width={6} height={10} rx={3} fill="#3F320D"/>
    <rect x={12} y={14} width={6} height={10} rx={3} fill="#3F320D"/>
    <path d="M42 30C42 30 34.4037 30 28.5 30C22.5963 30 14 30 14 30" stroke="#3F320D" strokeWidth={4} strokeLinecap="round"/>
    </svg>
  );
};

export default Meh;
