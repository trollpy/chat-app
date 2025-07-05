import React from 'react';
import Header from '../navigation/Header';
import MobileMenu from '../navigation/MobileMenu';

const Layout = ({ children }) => {
  return (
    <div 
      className="min-h-screen bg-gray-50 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ 
        backgroundImage: "url('/path/to/your/image.jpg')",
      }}
    >
      <Header />
      <MobileMenu />
      <main>{children}</main>
    </div>
  );
};

export default Layout;