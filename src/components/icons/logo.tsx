import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Capsule / pill shape */}
      <rect x="2.8" y="7" width="14.4" height="9.6" rx="4.8" transform="rotate(-30 2.8 7)" fill="none" />
      {/* Divide line */}
      <line x1="3.8" y1="6.1" x2="15.6" y2="16.9" />
      {/* Medical cross on the right */}
      <g transform="translate(16,6)">
        <rect x="0" y="3" width="6" height="6" rx="1" fill="currentColor" stroke="none" />
        <path d="M2.8 5.5v3.9M1 7.45h4.6" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}