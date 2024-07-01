import React, { useState } from 'react';
import MaterialForm from './MaterialForm';
import MaterialList from './MaterialList';
import { Container, Button, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const MaterialsPage = () => {
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Stato per forzare il refresh

  const closeModal = () => {
    setShowMaterialModal(false);
    setEditingMaterial(null);
  };

  const handleEditMaterial = (id) => {
    setEditingMaterial(id);
    setShowMaterialModal(true);
  };

  const handleSaveMaterial = () => {
    setRefreshKey(oldKey => oldKey + 1); // Forza il refresh incrementando il refreshKey
    closeModal();
  };

  return (
    <Container>
      <Box mb={2}>
        <Button
          variant="outlined"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setShowMaterialModal(true)}
        >
          Crea Materiale
        </Button>
      </Box>

      <MaterialList onEdit={handleEditMaterial} key={refreshKey} />

      {showMaterialModal && (
        <>
          <div style={overlayStyle} onClick={closeModal}></div>
          <div style={modalStyle}>
            <MaterialForm materialId={editingMaterial} onClose={closeModal} onSave={handleSaveMaterial} />
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

export default MaterialsPage;