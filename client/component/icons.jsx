import React from 'react';

export const TriangleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
    <path d="M12 2 L2 22 L22 22 Z" />
  </svg>
);

export const DiamondIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
    <path d="M12 2 L22 12 L12 22 L2 12 Z" />
  </svg>
);

export const CircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export const SquareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-green-500">
    <rect x="2" y="2" width="20" height="20" />
  </svg>
);