import React from 'react';
import { Link } from 'react-router-dom';

const homePageStyle = {
  textAlign: 'center',
  padding: '50px 20px',  // Aggiunto padding per migliorare lo spaziamento
};

const headerStyle = {
  fontSize: '36px',
  fontWeight: 'bold',
  marginBottom: '30px',  // Aggiunto margine inferiore per separare dalla sezione azioni
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
  width: '200px',  // Aggiunto larghezza fissa per uniformità delle azioni
};

const iconStyle = {
  fontSize: '48px',
  color: 'green',
};

const HomePage = () => {
  return (
    <div style={homePageStyle}>
      <div style={headerStyle}>
        BENVENUTO
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
        <Link to="/receipts" style={actionStyle}>
          <div style={iconStyle}>+</div>
          <div>Crea Ricevuta</div>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;