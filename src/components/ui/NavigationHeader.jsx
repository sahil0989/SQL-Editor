import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AssignmentBreadcrumb from './AssignmentBreadcrumb';
import Icon from '../AppIcon';

const NavigationHeader = ({ currentAssignment = null, onNavigateBack = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAttemptScreen = location?.pathname === '/assignment-attempt';

  useEffect(() => {
    const savedTheme = document.documentElement?.classList?.contains('dark');
    setIsDark(savedTheme);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    navigate('/assignment-listing');
  };

  const handleToggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement?.classList?.toggle('dark', next);
  };

  const handleBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    } else {
      navigate('/assignment-listing');
    }
  };

  return (
    <header
      className="nav-header"
      style={{
        boxShadow: scrolled
          ? '0 2px 6px rgba(15, 23, 42, 0.10)'
          : '0 1px 3px rgba(15, 23, 42, 0.08)',
        transition: 'box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      role="banner"
    >
      <div className="nav-header-inner">
        {/* Logo */}
        <button
          className="nav-logo-container"
          onClick={handleLogoClick}
          aria-label="Go to Assignment Listing - SQLab home"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <div className="nav-logo-icon" aria-hidden="true">
            <Icon name="Database" size={18} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          <span className="nav-logo-text">
            SQL<span>ab</span>
          </span>
        </button>

        {/* Center: Breadcrumb context on attempt screen */}
        {isAttemptScreen && currentAssignment && (
          <div className="flex-1 flex justify-center px-4">
            <AssignmentBreadcrumb
              assignment={currentAssignment}
              onBack={handleBack}
            />
          </div>
        )}

        {/* Right actions */}
        <div className="nav-actions">
          {/* Back to assignments - visible only on attempt screen when no breadcrumb space */}
          {isAttemptScreen && !currentAssignment && (
            <button
              className="breadcrumb-back-btn"
              onClick={handleBack}
              aria-label="Back to assignments list"
            >
              <Icon name="ArrowLeft" size={16} />
              <span className="hidden sm:inline">Assignments</span>
            </button>
          )}

          {/* Theme toggle */}
          <button
            className="nav-icon-btn"
            onClick={handleToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            <Icon name={isDark ? 'Sun' : 'Moon'} size={18} />
          </button>

          {/* Help */}
          <button
            className="nav-icon-btn"
            onClick={() => {}}
            aria-label="Help and documentation"
            title="Help"
          >
            <Icon name="HelpCircle" size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;