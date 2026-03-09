import React from 'react';
import { NavLink } from 'react-router-dom';
import AppLayout from './AppLayout';
import { motion } from 'framer-motion';
import {
  FiLayout, FiFileText, FiHeart, FiCalendar,
  FiShoppingCart, FiUser, FiChevronRight, FiStar
} from 'react-icons/fi';
import Button from '../common/Button';

const sidebarItems = [
  { to: '/dashboard', label: 'Overview', icon: <FiLayout /> },
  { to: '/my-recipes', label: 'My Creations', icon: <FiFileText /> },
  { to: '/favorites', label: 'Saved Recipes', icon: <FiHeart /> },
  { to: '/meal-plans', label: 'Meal Planner', icon: <FiCalendar /> },
  { to: '/shopping-lists', label: 'Grocery Lists', icon: <FiShoppingCart /> },
  { to: '/profile', label: 'Chef Profile', icon: <FiUser /> }
];

const DashboardLayout = ({ children }) => {
  return (
    <AppLayout>
      <div className="container-app py-10">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[220px,minmax(0,1fr)] xl:grid-cols-[260px,minmax(0,1fr)] items-start">
          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 z-10 hidden md:block">
            <div className="px-4 py-2">
              <h2 className="text-2xl font-bold text-surface-900 tracking-tight">Chef Workspace</h2>
              <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mt-1">Manage your kitchen</p>
            </div>

            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/dashboard'}
                  className={({ isActive }) => `
                    group flex items-center justify-between px-4 py-3.5 rounded-xl font-semibold transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-200' 
                      : 'text-surface-600 hover:bg-white hover:text-primary-600 hover:shadow-sm border border-transparent hover:border-surface-200'}
                  `}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm tracking-tight">{item.label}</span>
                  </div>
                  <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              ))}
            </nav>

            <div className="bg-gradient-to-br from-surface-900 to-surface-800 rounded-2xl p-6 text-white overflow-hidden relative shadow-xl">
              {/* Decoration */}
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FiStar size={64} />
              </div>
              
              <div className="relative z-10">
                <span className="inline-block px-2 py-0.5 rounded bg-primary-500 text-[10px] font-black uppercase tracking-widest mb-3">
                  RecipeHub Pro
                </span>
                <h4 className="text-lg font-bold mb-2">Master your kitchen</h4>
                <p className="text-xs text-surface-300 mb-6 leading-relaxed">
                  Get exclusive recipes, unlimited meal plans, and advanced nutrition analytics.
                </p>
                <Button variant="outline" size="sm" fullWidth className="!border-white/20 !text-white hover:!bg-white/10">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full min-w-0"
          >
            {children}
          </motion.section>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardLayout;