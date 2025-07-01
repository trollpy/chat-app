import React from 'react';
import Header from '../navigation/Header';
import MobileMenu from '../navigation/MobileMenu';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MobileMenu />
      <main>{children}</main>
    </div>
  );
};

export default Layout;