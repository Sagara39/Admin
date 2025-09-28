import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <path d="M17.7 20.9c-.4.4-.9.7-1.4.9-2.6.9-6.2-1.4-6.2-1.4s-3.6-2.3-6.2-1.4c-.5.2-1 .5-1.4.9" />
        <path d="M5.3 15.8c.4-.4.9-.7 1.4-.9 2.6-.9 6.2 1.4 6.2 1.4s3.6 2.3 6.2 1.4c.5-.2 1-.5 1.4-.9" />
        <path d="M12 11.2V7.1c0-1.7-1.3-3-3-3H7.9c-1.7 0-3 1.3-3 3v4.1" />
        <path d="m12 11.2 2.8 5.6" />
        <path d="M19.1 4.1h-2.2c-1.7 0-3 1.3-3 3v4.1" />
        <path d="M12 7.1h1.1" />
    </svg>
  );
}