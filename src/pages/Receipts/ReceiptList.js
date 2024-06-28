import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const ReceiptList = ({ onEdit }) => {
  const [receipts, setReceipts] = useState([]);
  const [deleteReceiptId, setDeleteReceiptId] = useState(null);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const response = await axios.get('http://localhost:9090/api/receipts');
      setReceipts(response.data || []);
    } catch (error) {
      console.error('Error fetching receipts', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9090/api/receipts/${id}`);
      fetchReceipts(); // Refresh the list after deletion
      setDeleteReceiptId(null);
    } catch (error) {
      console.error('Error deleting receipt', error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteReceiptId(id);
  };

  const closeDialog = () => {
    setDeleteReceiptId(null);
  };

  return (
    <>
      <List>
        {receipts.map((receipt) => (
          <ListItem key={receipt.id}>
            <ListItemText
              primary={`Receipt #${receipt.receiptNumber}`}
              secondary={`User: ${receipt.user ? `${receipt.user.firstName} ${receipt.user.lastName}` : 'Unknown'}, 
                          Material: ${receipt.material ? receipt.material.name : 'Unknown'}, 
                          Quantity: ${receipt.quantity}, 
                          Unit Price: ${receipt.unitPrice}, 
                          Total Price: ${receipt.totalPrice}, 
                          Payment Type: ${receipt.paymentType}`}
            />
            <IconButton edge="end" onClick={() => onEdit(receipt.id)}>
              <Edit />
            </IconButton>
            <IconButton edge="end" onClick={() => confirmDelete(receipt.id)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Dialog open={Boolean(deleteReceiptId)} onClose={closeDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this receipt?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={() => handleDelete(deleteReceiptId)} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReceiptList;
