import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';

const UserForm = ({ userId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    codiceFiscale: '',
    birthDate: '',
    birthPlace: '',
    residenza: ''
  });

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  const fetchUser = async (id) => {
    try {
      const response = await axios.get(`http://localhost:9090/api/users/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching user', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userId) {
        await axios.put(`http://localhost:9090/api/users/${userId}`, formData);
      } else {
        await axios.post('http://localhost:9090/api/users', formData);
      }
      if (onSave) {
        onSave();
      }
      // Aggiungi questa linea per aggiornare la pagina
      window.location.reload();
    } catch (error) {
      console.error('Error saving user', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        {userId ? 'Edit User' : 'Create User'}
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="firstName"
        label="First Name"
        name="firstName"
        autoComplete="firstName"
        value={formData.firstName}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="lastName"
        label="Last Name"
        name="lastName"
        autoComplete="lastName"
        value={formData.lastName}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="codiceFiscale"
        label="Codice Fiscale"
        name="codiceFiscale"
        autoComplete="codiceFiscale"
        value={formData.codiceFiscale}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="birthDate"
        label="Birth Date"
        name="birthDate"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={formData.birthDate}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="birthPlace"
        label="Birth Place"
        name="birthPlace"
        autoComplete="birthPlace"
        value={formData.birthPlace}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="residenza"
        label="Residenza"
        name="residenza"
        autoComplete="residenza"
        value={formData.residenza}
        onChange={handleChange}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Save
      </Button>
      {onClose && (
        <Button fullWidth variant="outlined" onClick={onClose}>
          Close
        </Button>
      )}
    </Box>
  );
};

export default UserForm;
