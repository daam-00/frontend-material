import React from 'react';
import { Link } from 'react-router-dom';

const homePageStyle = {
  textAlign: 'center',
};

const logoCenterStyle = {
  width: '200px',
  height: 'auto',
};

const actionsStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '30px',
  marginTop: '50px',
};

const actionStyle = {
  textAlign: 'center',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '10px',
  textDecoration: 'none',
  color: '#333',
};

const iconStyle = {
  fontSize: '48px',
  color: 'green',
};

const HomePage = () => {
  return (
    <div style={homePageStyle}>
      <div className="logo-center">
        <img src="/path-to-logo.png" alt="Logo" style={logoCenterStyle} />
      </div>
      <div style={actionsStyle}>
        <Link to="/users" style={actionStyle}>
          <div style={iconStyle}>+</div>
          <div>Crea Utente</div>
        </Link>
        <Link to="/materials" style={actionStyle}>
          <div style={iconStyle}>+</div>
          <div>Crea Materiale</div>
        </Link>
        <Link to="/create-receipt" style={actionStyle}>
          <div style={iconStyle}>+</div>
          <div>Crea Ricevuta</div>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
