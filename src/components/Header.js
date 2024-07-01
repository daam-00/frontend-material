import React from 'react';
import { Link } from 'react-router-dom';

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px',
  backgroundColor: '#f8f8f8',
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
  const logoStyle = {
    width: '100px',  // Imposta la larghezza dell'immagine
    height: 'auto',  // L'altezza si adatterà proporzionalmente alla larghezza
  };

  return (
    <header style={headerStyle}>
      <img src="https://i.ibb.co/0hM0GDn/Reviva-Full-Logo-Color-con-f.png" alt="Logo" style={logoStyle} />
      <nav>
        <ul style={navStyle}>
          <li><Link to="/" style={navLinkStyle}>Home</Link></li>
          <li><Link to="/users" style={navLinkStyle}>Utenti</Link></li>
          <li><Link to="/materials" style={navLinkStyle}>Materiali</Link></li>
          <li><Link to="/receipts" style={navLinkStyle}>Ricevuta</Link></li>
        </ul>
      </nav>
      <div style={companyNameStyle}>REGISTRO METALLI</div>
    </header>
  );
};

export default Header;