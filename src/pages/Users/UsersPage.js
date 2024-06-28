import React, { useState } from 'react';
import UserForm from './UserForm';
import UserList from './UserList';
import { Container, Button, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const UsersPage = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const closeModal = () => {
    setShowUserModal(false);
    setEditingUser(null);
  };

  const handleEditUser = (id) => {
    setEditingUser(id);
    setShowUserModal(true);
  };

  return (
    <Container>
      <Box mb={2}>
        <Button
          variant="outlined"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setShowUserModal(true)}
        >
          Crea Utente
        </Button>
      </Box>

      <UserList onEdit={handleEditUser} />

      {showUserModal && (
        <>
          <div style={overlayStyle} onClick={closeModal}></div>
          <div style={modalStyle}>
            <UserForm userId={editingUser} onClose={closeModal} />
          </div>
        </>
      )}
    </Container>
  );
};

const modalStyle = {
  display: 'block',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '20px',
  backgroundColor: 'white',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  borderRadius: '10px',
  zIndex: '1000',
};

const overlayStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: '999',
};

export default UsersPage;
