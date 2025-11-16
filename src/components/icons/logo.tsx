import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="none"
      {...props}
    >
      {/* Left half of capsule */}
      <path d="M3.5 12c0-2.5 2-4.5 4.5-4.5l6.5 6.5c-2.5 2.5-4.5 2.5-7 2.5S3.5 16.5 3.5 14V12z" fill="currentColor" />
      {/* Right half of capsule */}
      <path d="M21 9.5c0 2.5-2 4.5-4.5 4.5L10 7.5C12.5 5 14.5 5 17 5s4 2 4 4.5z" fill="currentColor" />
      {/* Divider */}
      <line x1="8" y1="5" x2="16" y2="13" stroke="rgba(255,255,255,0.85)" strokeWidth="0.8" strokeLinecap="round" />
      {/* White cross badge */}
      <g transform="translate(15,3)">
        <circle cx="3" cy="3" r="3" fill="#ffffff" />
        <path d="M3 1.6v2.8M1.6 3h2.8" stroke="#10B981" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}