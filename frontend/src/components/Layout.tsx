import React, { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Menu, 
  X, 
  GraduationCap, 
  ChevronRight,
  Clock
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Students', path: '/students', icon: Users },
  ];

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    return (
      <div className="flex items-center space-x-2 text-sm font-medium text-text-muted">
        <span className="hover:text-text-title cursor-pointer" onClick={() => navigate('/')}>SMS</span>
        <ChevronRight size={14} />
        {pathnames.length === 0 ? (
          <span className="text-text-title">Dashboard</span>
        ) : (
          pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const formattedName = isNaN(Number(name))
              ? name.charAt(0).toUpperCase() + name.slice(1)
              : `Detail #${name}`;

            return (
              <React.Fragment key={name}>
                {index > 0 && <ChevronRight size={14} />}
                {isLast ? (
                  <span className="text-text-title font-semibold">{formattedName}</span>
                ) : (
                  <span className="hover:text-text-title cursor-pointer" onClick={() => navigate(routeTo)}>
                    {formattedName}
                  </span>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
    );
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex min-h-screen bg-surface-bg">
      {/* Sidebar — Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-surface-border bg-surface-card z-20">
        <div className="flex items-center space-x-3 px-6 py-6 border-b border-surface-border cursor-pointer" onClick={() => navigate('/')}>
          <div className="p-2 rounded-md bg-brand-purple text-[#101010]">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display leading-tight text-text-title">Aegis Academics</h1>
            <span className="text-xs text-text-muted font-medium">Portal Console</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2.5 rounded-md font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-brand-purple/10 text-brand-purple'
                    : 'text-text-body hover:bg-surface-bg hover:text-text-title'
                }`
              }
            >
              {({ isActive }) => {
                const Icon = item.icon;
                return (
                  <>
                    <Icon
                      size={20}
                      className={`transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-brand-purple' : 'text-text-muted group-hover:text-text-title'
                      }`}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activeDot"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-purple"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                );
              }}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-surface-border">
          <div className="rounded-lg p-4 bg-surface-bg text-center space-y-1 border border-surface-border">
            <p className="text-xs text-text-muted font-medium">Running Local Port</p>
            <p className="text-xs font-bold text-text-title">REST: 8080 | WEB: 3000</p>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/55 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative flex flex-col w-64 bg-surface-card border-r border-surface-border p-6 z-10"
            >
              <div className="flex items-center justify-between pb-6 border-b border-surface-border mb-6">
                <div className="flex items-center space-x-2">
                  <GraduationCap size={24} className="text-brand-purple" />
                  <span className="text-base font-bold font-display text-text-title">Aegis Academy</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-md text-text-muted hover:bg-surface-bg hover:text-text-title"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-2.5 rounded-md font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-brand-purple/10 text-brand-purple font-semibold'
                          : 'text-text-body hover:bg-surface-bg'
                      }`
                    }
                  >
                    {({ isActive }) => {
                      const Icon = item.icon;
                      return (
                        <>
                          <Icon size={20} className={isActive ? 'text-brand-purple' : 'text-text-muted'} />
                          <span>{item.name}</span>
                        </>
                      );
                    }}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-surface-card/90 backdrop-blur-sm border-b border-surface-border h-16 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-md text-text-body hover:bg-surface-bg hover:text-text-title transition-colors duration-150"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">{getBreadcrumbs()}</div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2 text-xs font-semibold text-text-muted bg-surface-bg border border-surface-border px-3.5 py-1.5 rounded-full">
              <Clock size={12} className="text-brand-purple" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
