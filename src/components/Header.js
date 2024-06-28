import React from 'react';
import { Link } from 'react-router-dom';

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px',
  backgroundColor: '#f8f8f8',
};

const logoStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
};

const navStyle = {
  listStyle: 'none',
  display: 'flex',
  gap: '15px',
};

const navLinkStyle = {
  textDecoration: 'none',
  color: '#333',
};

const companyNameStyle = {
  fontSize: '18px',
};

const Header = () => {
  return (
    <header style={headerStyle}>
      <div style={logoStyle}>LOGO</div>
      <nav>
        <ul style={navStyle}>
          <li><Link to="/" style={navLinkStyle}>Home</Link></li>
          <li><Link to="/users" style={navLinkStyle}>Users</Link></li>
          <li><Link to="/materials" style={navLinkStyle}>Materials</Link></li>
          <li><Link to="/receipts" style={navLinkStyle}>Receipts</Link></li>
        </ul>
      </nav>
      <div style={companyNameStyle}>Company Name</div>
    </header>
  );
};

export default Header;
