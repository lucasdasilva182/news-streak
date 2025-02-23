import { Link } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header>
      <nav className="bg-background border-gray-200 px-4 lg:px-6 py-2.5 w-full top-0 left-0 z-10 h-20 ">
        <div className="flex flex-wrap justify-between items-center  h-full container">
          <span></span>
          <Link to="/streaks" className="flex items-center">
            <img src="/thenews.webp" className=" h-6 sm:h-9" alt="The News Logo" />
          </Link>
          <div className="flex items-center gap-4">
            {user && user.is_admin === 1 && (
              <Link
                to="/admin"
                className="text-primary flex gap-1 items-center justify-center border border-primary rounded-md px-2 py-1"
              >
                <span className="text-foreground text-sm hidden md:flex">Admin</span>{' '}
                <Settings size={16} />
              </Link>
            )}
            <a className="cursor-pointer" onClick={handleLogout}>
              <LogOut size={16} className="text-destructive" />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
