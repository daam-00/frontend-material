import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import UsersPage from './pages/Users/UsersPage';
import MaterialsPage from './pages/Materials/MaterialsPage';
import ReceiptsPage from './pages/Receipts/ReceiptsPage';
import Header from './components/Header';
import Footer from './components/Footer';
import MaterialForm from './pages/Materials/MaterialForm';
import UserForm from './pages/Users/UserForm';
const appStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

const mainStyle = {
  flex: '1',
};

const App = () => {
  return (
    <Router>
      <div style={appStyle}>
        <Header />
        <main style={mainStyle}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/materials" element={<MaterialsPage />} />
            <Route path="/receipts" element={<ReceiptsPage />} />
          

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
