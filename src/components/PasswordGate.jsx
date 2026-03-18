import { useState, useEffect } from 'react';
import './PasswordGate.css';

export default function PasswordGate({ password, isOpen, onClose, onSuccess }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValue('');
      setError('');
      setShowPassword(false);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          if (onClose) {
            onClose();
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
    return undefined;
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (value === password) {
      if (onSuccess) {
        onSuccess();
      }
    } else {
      setError('Incorrect password');
    }
  };

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleInnerClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="password-gate" onClick={handleOverlayClick}>
      <div className="password-gate-inner" onClick={handleInnerClick}>
        <button
          type="button"
          className="password-gate-back"
          onClick={onClose}
          aria-label="Close password dialog"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="password-gate-lock-icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 className="password-gate-title">This content is protected.</h1>
        <p className="password-gate-subtitle">To view, please enter the password.</p>
        <form className="password-gate-form" onSubmit={handleSubmit}>
          <div className="password-gate-input-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              className="password-gate-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              autoFocus
              aria-label="Password"
            />
            <button
              type="button"
              className="password-gate-reveal"
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <button type="submit" className="password-gate-submit">
            Submit
          </button>
          {error && <p className="password-gate-error" role="alert">{error}</p>}
        </form>
      </div>
    </div>
  );
}
