import React, { useState } from "react";
import { Button } from "./ui";
import Modal from "./ui/Modal";
import LoginForm from "./auth/LoginForm";

const Navbar = ({ user, onLogin, onLogout }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogin = (userData) => {
    onLogin(userData);
    setShowLoginModal(false);
  };

  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand with hover animation */}
          <div className="flex-shrink-0 text-blue-400 font-bold text-xl transition-all duration-300 hover:text-blue-300 cursor-pointer">
            FinSight
          </div>

          {/* Login/User section with animations */}
          <div>
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200"
                >
                  <span>{user.name || user.email.split("@")[0]}</span>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
                    <span className="text-white font-medium">
                      {(user.name || user.email)[0].toUpperCase()}
                    </span>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 py-1 bg-gray-800 rounded-md shadow-lg border border-gray-700 z-10 animate-slideDown">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-150"
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={() => setShowLoginModal(true)}
                className="transition-transform duration-300 hover:-translate-y-1 active:translate-y-0.5"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginForm onSubmit={handleLogin} />
      </Modal>
    </nav>
  );
};

export default Navbar;
