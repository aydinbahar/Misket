import React from 'react';

export const SkeletonCard = () => (
  <div className="card">
    <div className="skeleton h-6 w-3/4 mb-4"></div>
    <div className="skeleton h-4 w-full mb-2"></div>
    <div className="skeleton h-4 w-5/6 mb-2"></div>
    <div className="skeleton h-4 w-4/6"></div>
  </div>
);

export const SkeletonProgress = () => (
  <div className="card">
    <div className="flex items-center justify-between mb-4">
      <div className="skeleton h-8 w-24"></div>
      <div className="skeleton h-10 w-16 rounded-full"></div>
    </div>
    <div className="skeleton h-3 w-full rounded-full"></div>
  </div>
);

export const SkeletonButton = () => (
  <div className="skeleton h-12 w-full rounded-xl"></div>
);

export const SkeletonStat = () => (
  <div className="card text-center">
    <div className="skeleton h-10 w-16 mx-auto mb-2"></div>
    <div className="skeleton h-4 w-20 mx-auto"></div>
  </div>
);

