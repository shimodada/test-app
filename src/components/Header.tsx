import React from 'react';
import './Header.css';

type Props = {
  title?: string;
};

const Header: React.FC<Props> = ({ title = 'New App' }) => {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-brand">
          <h1 className="site-title">{title}</h1>
        </div>
        <nav className="site-nav">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
