import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  backTo?: {
    label: string;
    href: string;
  };
  className?: string;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  items,
  backTo,
  className = '',
}) => {
  const navigate = useNavigate();

  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 py-3 border-b border-neutral-800/80 mb-6 ${className}`}>
      {/* Clickable Breadcrumbs Hierarchy */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider">
        <Link
          to="/"
          className="text-neutral-400 hover:text-white transition-colors duration-150 flex items-center gap-1"
        >
          <span>HOME</span>
        </Link>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="text-neutral-400 hover:text-red-400 hover:underline transition-colors duration-150 whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-red-500 font-bold tracking-widest whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Explicit Back Button for Desktop & Mobile */}
      {backTo ? (
        <Link
          to={backTo.href}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300 bg-neutral-900/90 hover:bg-red-950/60 hover:text-white border border-neutral-700/60 hover:border-red-600/60 rounded transition-all duration-150"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
          <span>BACK TO {backTo.label}</span>
        </Link>
      ) : (
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300 bg-neutral-900/90 hover:bg-neutral-800 hover:text-white border border-neutral-700/60 rounded transition-all duration-150 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-neutral-400" />
          <span>BACK</span>
        </button>
      )}
    </div>
  );
};

export default BreadcrumbNav;
