import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <span className="material-symbols-outlined text-[120px] text-primary">coffee_maker</span>
        <h1 className="font-display-lg-mobile lg:text-display-lg text-on-surface">404</h1>
        <p className="font-headline-md text-headline-md text-on-surface-variant">
          This brew doesn't exist
        </p>
        <p className="font-body-lg text-body-lg text-outline">
          The page you're looking for has been moved or doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-container text-on-primary-container hover:bg-primary-container/90 transition-all shadow-glow-primary font-label-lg text-label-lg"
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          <span>Back to Menu</span>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
