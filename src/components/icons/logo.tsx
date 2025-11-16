import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      {/* Medical plus sign / cross */}
      <rect x="10" y="2" width="4" height="20" rx="2" fill="currentColor" />
      <rect x="2" y="10" width="20" height="4" rx="2" fill="currentColor" />
    </svg>
  );
}