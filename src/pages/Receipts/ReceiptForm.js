import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Box, Typography, TextField, Button, Grid, MenuItem } from '@mui/material';
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
    paymentType2: '',
    amount2: '',
    dueDate2: '',
    paymentType3: '',
    amount3: '',
    dueDate3: '',
    paymentType4: '',
    amount4: '',
    dueDate4: '',
    paymentType5: '',
    amount5: '',
    dueDate5: '',
  });
  const [users, setUsers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [additionalPayments, setAdditionalPayments] = useState([]);

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
      console.error('Errore durante il recupero degli utenti', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await axios.get('http://localhost:9090/api/materials');
      setMaterials(response.data);
    } catch (error) {
      console.error('Errore durante il recupero dei materiali', error);
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
      console.error('Errore durante il recupero dell\'ultimo numero di ricevuta', error);
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

  const handleAddPayment = () => {
    const newIndex = additionalPayments.length + 2;
    setAdditionalPayments([
      ...additionalPayments,
      {
        amount: '',
        paymentType: '',
        dueDate: '',
        amountField: `amount${newIndex}`,
        paymentTypeField: `paymentType${newIndex}`,
        dueDateField: `dueDate${newIndex}`,
      },
    ]);
  };

  const handlePaymentChange = (index, field, value) => {
    const updatedPayments = [...additionalPayments];
    updatedPayments[index] = {
      ...updatedPayments[index],
      [field]: value,
    };
    setAdditionalPayments(updatedPayments);
    const formDataField = updatedPayments[index][`${field}Field`];
    setFormData({
      ...formData,
      [formDataField]: value,
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
        payments: additionalPayments
      };
      await axios.post('http://localhost:9090/api/receipts', dataToSend);
      onSave();
      onClose();
    } catch (error) {
      console.error('Errore durante il salvataggio della ricevuta', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Crea Ricevuta
        </Typography>
        <Autocomplete
          options={users}
          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
          onChange={handleUserChange}
          renderInput={(params) => <TextField {...params} label="Utente" required />}
        />
        <Autocomplete
          options={materials}
          getOptionLabel={(option) => option.name}
          onChange={handleMaterialChange}
          renderInput={(params) => <TextField {...params} label="Materiale" required />}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="description"
          label="Codice FIR"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="unitPrice"
          label="Prezzo Unitario"
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
          label="Quantità(Kg)"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleQuantityChange}
        />
        <TextField
          margin="normal"
          fullWidth
          id="totalPrice"
          label="Prezzo Totale"
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
          label="Numero di Ricevuta"
          name="receiptNumber"
          value={formData.receiptNumber}
          onChange={handleChange}
        />
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              margin="normal"
              fullWidth
              id="amount"
              label="Importo"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              inputProps={{ inputMode: 'decimal', pattern: '[0-9]+([,][0-9]{1,2})?' }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              margin="normal"
              fullWidth
              select
              id="paymentType"
              label="Tipo di Pagamento"
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
            >
              <MenuItem value="Contanti">Contanti</MenuItem>
              <MenuItem value="Bonifico Bancario">Bonifico Bancario</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField
              margin="normal"
              fullWidth
              id="dueDate"
              label="Scadenza"
              name="dueDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.dueDate}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        {additionalPayments.map((payment, index) => (
          <Grid key={index} container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={4}>
              <TextField
                margin="normal"
                fullWidth
                id={payment.amountField}
                label={`Importo ${index + 2}`}
                name={payment.amountField}
                value={payment.amount}
                onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)}
                inputProps={{ inputMode: 'decimal', pattern: '[0-9]+([,][0-9]{1,2})?' }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                margin="normal"
                fullWidth
                select
                id={payment.paymentTypeField}
                label={`Tipo di Pagamento ${index + 2}`}
                name={payment.paymentTypeField}
                value={payment.paymentType}
                onChange={(e) => handlePaymentChange(index, 'paymentType', e.target.value)}
              >
                <MenuItem value="Contanti">Contanti</MenuItem>
                <MenuItem value="Bonifico Bancario">Bonifico Bancario</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                margin="normal"
                fullWidth
                id={payment.dueDateField}
                label={`Scadenza ${index + 2}`}
                name={payment.dueDateField}
                type="date"
                InputLabelProps={{ shrink: true }}
                value={payment.dueDate}
                onChange={(e) => handlePaymentChange(index, 'dueDate', e.target.value)}
              />
            </Grid>
          </Grid>
        ))}
        <Button variant="outlined" onClick={handleAddPayment}>
          Aggiungi Pagamento
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSubmit}
        >
          Salva
        </Button>
      </Box>
    </Modal>
  );
};

export default ReceiptForm;
