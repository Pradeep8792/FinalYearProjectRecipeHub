import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';

/**
 * Premium StatCard Component for Dashboards
 */
const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  status,
  className = '',
  compact = false
}) => {
  const trendNum = typeof trend === 'number' ? trend : parseFloat(String(trend || '0'));
  const hasTrend = trend !== undefined && trend !== null && trend !== '';
  const isPositive = trendNum > 0;
  const isNegative = trendNum < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`card-premium relative overflow-hidden group ${className}`}
    >
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl group-hover:bg-primary-500/10 transition-colors" />

      <div className="flex items-start justify-between mb-4">
        <div className={`
          flex items-center justify-center rounded-2xl transition-all duration-300
          ${compact ? 'h-10 w-10 text-xl' : 'h-12 w-12 text-2xl'}
          bg-primary-50 text-primary-500 ring-4 ring-primary-50/50
        `}>
          {icon}
        </div>

        {hasTrend && (
          <div className={`
            flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
            ${isPositive ? 'bg-success/10 text-success' : isNegative ? 'bg-danger/10 text-danger' : 'bg-surface-100 text-surface-600'}
          `}>
            {isPositive ? <FiArrowUpRight /> : isNegative ? <FiArrowDownRight /> : null}
            <span>{typeof trend === 'number' ? `${Math.abs(trend)}%` : String(trend)}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-surface-500 uppercase tracking-wider">{title}</p>
        <h3 className={`font-bold tracking-tight text-surface-900 ${compact ? 'text-2xl' : 'text-3xl lg:text-4xl'}`}>
          {value}
        </h3>
        
        {subtitle && (
          <p className="text-xs font-medium text-surface-400 mt-2 flex items-center gap-1">
            {subtitle}
          </p>
        )}

        {status && (
          <div className="mt-3">
            <span className="px-2 py-0.5 rounded-md bg-surface-50 text-[10px] font-bold text-surface-500 uppercase tracking-widest border border-surface-100">
              {status}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
