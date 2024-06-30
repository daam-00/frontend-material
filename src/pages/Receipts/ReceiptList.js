import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Delete, Save } from '@mui/icons-material';
import jsPDF from 'jspdf';

const ReceiptList = () => {
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

  const generatePDF = (receipt) => {
    const doc = new jsPDF();
    const user = receipt.user || {};
    const material = receipt.material || {};
    const formattedDate = new Date(receipt.date).toLocaleString();

    doc.text(`Receipt #${receipt.receiptNumber}`, 10, 10);
    doc.text(`User: ${user.firstName} ${user.lastName}`, 10, 20);
    doc.text(`Codice Fiscale: ${user.codiceFiscale}`, 10, 30);
    doc.text(`Birth Date: ${new Date(user.birthDate).toLocaleDateString()}`, 10, 40);
    doc.text(`Birth Place: ${user.birthPlace}`, 10, 50);
    doc.text(`Residenza: ${user.residenza}`, 10, 60);
    doc.text(`Material: ${material.name}`, 10, 70);
    doc.text(`Material Code: ${material.code}`, 10, 80);
    doc.text(`Quantity: ${receipt.quantity}`, 10, 90);
    doc.text(`Unit Price: ${receipt.unitPrice}`, 10, 100);
    doc.text(`Total Price: ${receipt.totalPrice}`, 10, 110);
    doc.text(`Payment Type: ${receipt.paymentType}`, 10, 120);
    doc.text(`Date: ${formattedDate}`, 10, 130);
    doc.save(`receipt_${receipt.receiptNumber}.pdf`);
  };

  return (
    <>
      <List>
        {receipts.map((receipt) => (
          <ListItem key={receipt.id}>
            <ListItemText
              primary={`Receipt #${receipt.receiptNumber}`}
              secondary={`User: ${receipt.user ? `${receipt.user.firstName} ${receipt.user.lastName}` : 'Unknown'}, 
                          Codice Fiscale: ${receipt.user ? receipt.user.codiceFiscale : 'Unknown'},
                          Birth Date: ${receipt.user ? new Date(receipt.user.birthDate).toLocaleDateString() : 'Unknown'},
                          Birth Place: ${receipt.user ? receipt.user.birthPlace : 'Unknown'},
                          Residenza: ${receipt.user ? receipt.user.residenza : 'Unknown'},
                          Material: ${receipt.material ? receipt.material.name : 'Unknown'}, 
                          Material Code: ${receipt.material ? receipt.material.code : 'Unknown'}, 
                          Quantity: ${receipt.quantity}, 
                          Unit Price: ${receipt.unitPrice}, 
                          Total Price: ${receipt.totalPrice}, 
                          Payment Type: ${receipt.paymentType},
                          Date: ${new Date(receipt.date).toLocaleString()}`}
            />
            <IconButton edge="end" onClick={() => generatePDF(receipt)}>
              <Save />
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
