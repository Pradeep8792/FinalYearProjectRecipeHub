import React, { useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

/**
 * Premium SearchBar Component
 */
const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Search recipes, ingredients...',
  className = '',
  onSubmit,
  isLoading = false,
  disabled = false,
  showClear = true
}) => {
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(e);
    }
  };

  const handleClear = () => {
    if (disabled) return;
    const syntheticEvent = { target: { value: '' } };
    onChange && onChange(syntheticEvent);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full group ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors pointer-events-none">
        <FiSearch size={20} />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full h-12 pl-12 pr-12 rounded-2xl border-2 border-surface-100 bg-surface-50 
          text-surface-900 placeholder-surface-400 transition-all duration-200
          focus:bg-white focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        aria-label="Search"
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {isLoading ? (
          <div className="h-5 w-5 border-2 border-surface-200 border-t-primary-500 animate-spin rounded-full" />
        ) : (
          showClear && value && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="p-1.5 rounded-full text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-colors"
              aria-label="Clear search"
            >
              <FiX size={18} />
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default SearchBar;

