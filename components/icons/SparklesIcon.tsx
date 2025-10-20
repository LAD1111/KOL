import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9.93 2.55a2 2 0 0 0-1.86 0L6.53 4.09a2 2 0 0 1-2.4 0L2.58 2.55a2 2 0 0 0-1.86 0L.17 4.09a2 2 0 0 0 0 3.46l1.54 1.54a2 2 0 0 1 0 2.8l-1.54 1.54a2 2 0 0 0 0 3.46l.55 1.54a2 2 0 0 0 1.86 0l1.54-1.54a2 2 0 0 1 2.4 0l1.54 1.54a2 2 0 0 0 1.86 0l.55-1.54a2 2 0 0 0 0-3.46l-1.54-1.54a2 2 0 0 1 0-2.8l1.54-1.54a2 2 0 0 0 0-3.46L9.93 2.55Z" />
    <path d="M18 8 20 10l-2 2" />
    <path d="m13.5 13.5 1 1" />
    <path d="M22 2 12 12" />
  </svg>
);

export default SparklesIcon;