import React, { useState } from 'react';
import ReceiptForm from './ReceiptForm';
import ReceiptList from './ReceiptList';
import { Container, Button, Box, TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ReceiptsPage = () => {
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddReceipt = () => {
    setShowReceiptModal(true);
  };

  const handleCloseModal = () => {
    setShowReceiptModal(false);
  };

  const handleSaveReceipt = () => {
    setShowReceiptModal(false);
    window.location.reload(); // Aggiorna la pagina dopo aver salvato la ricevuta
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Cerca per Numero di Ricevuta o Nome"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddReceipt}
        >
          Aggiungi Ricevuta
        </Button>
      </Box>
      <ReceiptList searchQuery={searchQuery} />
      <ReceiptForm open={showReceiptModal} onSave={handleSaveReceipt} onClose={handleCloseModal} />
    </Container>
  );
};

export default ReceiptsPage;