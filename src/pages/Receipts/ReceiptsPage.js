import React, { useState } from 'react';
import ReceiptForm from './ReceiptForm';
import ReceiptList from './ReceiptList';
import { Container, Button, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ReceiptsPage = () => {
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const handleAddReceipt = () => {
    setShowReceiptModal(true);
  };

  const handleCloseModal = () => {
    setShowReceiptModal(false);
  };

  const handleSaveReceipt = () => {
    setShowReceiptModal(false);
    window.location.reload(); // Refresh the page after saving the receipt
  };

  return (
    <Container>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddReceipt}
        >
          Add Receipt
        </Button>
      </Box>
      <ReceiptList />
      {showReceiptModal && (
        <ReceiptForm onSave={handleSaveReceipt} onClose={handleCloseModal} />
      )}
    </Container>
  );
};

export default ReceiptsPage;
