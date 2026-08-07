import * as React from "react";

const Happy = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={56} height={56} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={28} cy={28} r={28} fill="#F0CC00"/>
    <circle cx={28} cy={28} r={28} fill="#F0CC00"/>
    <rect x={38} y={14} width={6} height={10} rx={3} fill="#3F320D"/>
    <rect x={12} y={14} width={6} height={10} rx={3} fill="#3F320D"/>
    <path d="M42 30C42 30 33.9037 36 28 36C22.0963 36 14 30 14 30" stroke="#3F320D" strokeWidth={4} strokeLinecap="round"/>
    </svg>
  );
};

export default Happy;
