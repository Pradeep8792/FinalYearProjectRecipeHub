import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiMail, FiTwitter, FiYoutube } from 'react-icons/fi';
import { GiCookingPot } from 'react-icons/gi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: 'Explore Recipes', to: '/recipes' },
      { label: 'Categories', to: '/categories' },
      { label: 'Meal Planner', to: '/meal-plans' },
      { label: 'Creators', to: '/recipes' },
    ],
    company: [
      { label: 'About Us', to: '/' },
      { label: 'Terms of Service', to: '/' },
      { label: 'Privacy Policy', to: '/' },
      { label: 'Contact Support', to: '/' },
    ],
    social: [
      { icon: <FiInstagram size={20} />, label: 'Instagram', href: '#' },
      { icon: <FiTwitter size={20} />, label: 'Twitter', href: '#' },
      { icon: <FiFacebook size={20} />, label: 'Facebook', href: '#' },
      { icon: <FiYoutube size={20} />, label: 'YouTube', href: '#' },
    ]
  };

  return (
    <footer className="mt-20 border-t border-surface-200 bg-white pt-16 pb-8">
      <div className="container-app">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Branding */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-200">
                <GiCookingPot size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-surface-900">RecipeHub</span>
            </Link>
            <p className="text-surface-500 text-sm leading-relaxed max-w-xs">
              Empowering home chefs with professional tools to explore, create, and organize the world's best recipes.
            </p>
            <div className="flex items-center gap-4">
              {footerLinks.social.map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.href} 
                  className="text-surface-400 hover:text-primary-500 transition-colors"
                  aria-label={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-sm font-bold text-surface-900 uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4">
              {footerLinks.platform.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-surface-500 hover:text-primary-500 transition-colors text-sm font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-bold text-surface-900 uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-surface-500 hover:text-primary-500 transition-colors text-sm font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="text-sm font-bold text-surface-900 uppercase tracking-widest mb-6">Stay Connected</h4>
            <p className="text-surface-500 text-sm mb-4">Subscribe to our newsletter for weekly recipe inspiration.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-surface-50 border border-surface-200 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <button className="bg-primary-500 text-white p-2 rounded-xl hover:bg-primary-600 transition-colors">
                <FiMail size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-surface-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-surface-400 text-xs font-medium">
            &copy; {currentYear} RecipeHub Technologies Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-surface-400 hover:text-surface-600 text-xs font-semibold">Privacy Policy</Link>
            <Link to="/" className="text-surface-400 hover:text-surface-600 text-xs font-semibold">Security</Link>
            <Link to="/" className="text-surface-400 hover:text-surface-600 text-xs font-semibold">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

