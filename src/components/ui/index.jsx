import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${className}`}>
      {children}
    </div>
  );
};

export const Input = ({ label, type = 'text', placeholder, value, onChange, required, className = '' }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800"
      />
    </div>
  );
};

export const Btn = ({ children, type = 'button', onClick, loading, className = '', disabled }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative flex items-center justify-center gap-2 px-6 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:hover:bg-blue-600 rounded-xl transition-colors overflow-hidden ${className}`}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </motion.button>
  );
};

export const Badge = ({ label, bg, color, children, className = '' }) => {
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${className}`}
      style={{ backgroundColor: bg || '#EFF6FF', color: color || '#1D4ED8' }}
    >
      {label || children}
    </span>
  );
};
