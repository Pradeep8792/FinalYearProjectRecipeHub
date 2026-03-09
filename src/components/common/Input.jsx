import React, { useState, forwardRef } from 'react';
import { FiUpload, FiCheckCircle } from 'react-icons/fi';

/**
 * Premium Reusable Input Component
 * Supports text, password, email, textarea, file types, and prefix icons.
 *
 * @param {string} props.label - Field label text
 * @param {string} props.helperText - Helper text shown below input
 * @param {string} props.error - Error message; replaces helper text when set
 * @param {boolean} props.multiline - Render as textarea
 * @param {number} props.rows - Number of rows for textarea
 * @param {React.ReactNode} props.icon - Prefix icon element rendered inside the field
 * @param {string} props.type - Input type (text, email, password, file, etc.)
 */
const Input = forwardRef(
  (
    {
      label,
      helperText,
      error,
      className = '',
      multiline = false,
      rows = 4,
      type = 'text',
      icon = null,
      ...props
    },
    ref
  ) => {
    const [fileNames, setFileNames] = useState('');
    const disabled = props.disabled;

    /* Base classes for the input element */
    const baseInputClasses = `input-premium ${
      error ? 'border-danger focus:ring-red-100' : ''
    } ${icon ? 'pl-11' : ''}`;

    /* ───────────────────── File input ───────────────────── */
    if (type === 'file') {
      const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length) {
          const names = Array.from(files)
            .map((f) => f.name)
            .join(', ');
          setFileNames(names);
        } else {
          setFileNames('');
        }
        if (props.onChange) props.onChange(e);
      };

      return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
          {label && (
            <label className="text-sm font-semibold text-surface-700 ml-1">
              {label}
            </label>
          )}

          <div className="relative group">
            <input
              ref={ref}
              type="file"
              {...props}
              onChange={handleFileChange}
              className="sr-only"
              id={props.id || label}
            />

            <label
              htmlFor={props.id || label}
              className={`
                flex items-center justify-between w-full p-3 bg-white border-2 border-dashed
                ${
                  error
                    ? 'border-danger bg-red-50/30'
                    : 'border-surface-200 group-hover:border-primary-400'
                }
                rounded-xl cursor-pointer transition-all duration-200
                ${disabled ? 'opacity-50 cursor-not-allowed bg-surface-50' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    fileNames
                      ? 'bg-success/10 text-success'
                      : 'bg-primary-50 text-primary-500'
                  }`}
                >
                  {fileNames ? (
                    <FiCheckCircle size={20} />
                  ) : (
                    <FiUpload size={20} />
                  )}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-surface-900">
                    {fileNames ? 'File Selected' : 'Click to upload'}
                  </p>
                  <p className="text-surface-500 truncate max-w-[200px]">
                    {fileNames || props.placeholder || 'Choose a file...'}
                  </p>
                </div>
              </div>
              {!fileNames && (
                <span className="text-xs font-bold text-primary-500 uppercase tracking-wider px-3 py-1 bg-primary-50 rounded-full">
                  Browse
                </span>
              )}
            </label>
          </div>

          {helperText && !error && (
            <p className="text-xs text-surface-500 ml-1">{helperText}</p>
          )}
          {error && (
            <p className="text-xs font-medium text-danger ml-1">{error}</p>
          )}
        </div>
      );
    }

    /* ───────────────────── Textarea ───────────────────── */
    if (multiline || type === 'textarea') {
      return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
          {label && (
            <label className="text-sm font-semibold text-surface-700 ml-1">
              {label}
            </label>
          )}
          <textarea
            ref={ref}
            rows={rows}
            {...props}
            aria-invalid={!!error}
            className={`input-premium ${
              error ? 'border-danger focus:ring-red-100' : ''
            } resize-none min-h-[120px]`}
          />
          {helperText && !error && (
            <p className="text-xs text-surface-500 ml-1">{helperText}</p>
          )}
          {error && (
            <p className="text-xs font-medium text-danger ml-1">{error}</p>
          )}
        </div>
      );
    }

    /* ───────────────────── Default text input ───────────────────── */
    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label className="text-sm font-semibold text-surface-700 ml-1">
            {label}
          </label>
        )}

        {/* Wrapper for prefix icon */}
        <div className="relative">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none flex items-center">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            {...props}
            aria-invalid={!!error}
            className={baseInputClasses}
          />
        </div>

        {helperText && !error && (
          <p className="text-xs text-surface-500 ml-1">{helperText}</p>
        )}
        {error && (
          <p className="text-xs font-medium text-danger ml-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
