import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Box, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

const ReceiptForm = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    userId: null,
    materialId: null,
    description: '',
    unitPrice: '',
    quantity: 1,
    receiptNumber: '',
    paymentType: '',
    totalPrice: '',
    amount: '',
    dueDate: '',
  });
  const [users, setUsers] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchMaterials();
    fetchLastReceiptNumber();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:9090/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await axios.get('http://localhost:9090/api/materials');
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials', error);
    }
  };

  const fetchLastReceiptNumber = async () => {
    try {
      const response = await axios.get('http://localhost:9090/api/receipts/last-receipt-number');
      setFormData(prevData => ({
        ...prevData,
        receiptNumber: response.data + 1
      }));
    } catch (error) {
      console.error('Error fetching last receipt number', error);
    }
  };

  const handleUserChange = (event, value) => {
    setFormData({
      ...formData,
      userId: value ? value.id : null,
    });
  };

  const handleMaterialChange = (event, value) => {
    setFormData({
      ...formData,
      materialId: value ? value.id : null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUnitPriceChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      unitPrice: value,
      totalPrice: (parseFloat(value.replace(',', '.')) * formData.quantity).toFixed(2).replace('.', ','),
    });
  };

  const handleQuantityChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      quantity: value,
      totalPrice: (parseFloat(formData.unitPrice.replace(',', '.')) * value).toFixed(2).replace('.', ','),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        unitPrice: parseFloat(formData.unitPrice.replace(',', '.')),
        totalPrice: parseFloat(formData.totalPrice.replace(',', '.')),
        user: { id: formData.userId },
        material: { id: formData.materialId },
      };
      await axios.post('http://localhost:9090/api/receipts', dataToSend);
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving receipt', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Create Receipt
        </Typography>
        <Autocomplete
          options={users}
          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
          onChange={handleUserChange}
          renderInput={(params) => <TextField {...params} label="User" required />}
        />
        <Autocomplete
          options={materials}
          getOptionLabel={(option) => option.name}
          onChange={handleMaterialChange}
          renderInput={(params) => <TextField {...params} label="Material" required />}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="description"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="unitPrice"
          label="Unit Price"
          name="unitPrice"
          value={formData.unitPrice}
          onChange={handleUnitPriceChange}
          inputProps={{ inputMode: 'decimal', pattern: '[0-9]+([,][0-9]{1,2})?' }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="quantity"
          label="Quantity"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleQuantityChange}
        />
        <TextField
          margin="normal"
          fullWidth
          id="totalPrice"
          label="Total Price"
          name="totalPrice"
          value={formData.totalPrice}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="receiptNumber"
          label="Receipt Number"
          name="receiptNumber"
          value={formData.receiptNumber}
          onChange={handleChange}
        />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table aria-label="pagamenti table">
                <TableHead>
                  <TableRow>
                    <TableCell>Importo</TableCell>
                    <TableCell>Payment Type</TableCell>
                    <TableCell>Scadenza</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="amount"
                        label="Amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        select
                        id="paymentType"
                        label="Payment Type"
                        name="paymentType"
                        value={formData.paymentType}
                        onChange={handleChange}
                      >
                        <MenuItem value="Bonifico">Bonifico</MenuItem>
                        <MenuItem value="Contanti">Contanti</MenuItem>
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="dueDate"
                        label="Scadenza"
                        name="dueDate"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.dueDate}
                        onChange={handleChange}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Save
          </Button>
          {onClose && (
            <Button fullWidth variant="outlined" onClick={onClose}>
              Close
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ReceiptForm;
