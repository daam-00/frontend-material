import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

const MaterialForm = ({ materialId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: ''
  });

  useEffect(() => {
    if (materialId) {
      fetchMaterial(materialId);
    }
  }, [materialId]);

  const fetchMaterial = async (id) => {
    try {
      const response = await axios.get(`http://localhost:9090/api/materials/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching material', error);
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
      if (materialId) {
        await axios.put(`http://localhost:9090/api/materials/${materialId}`, formData);
      } else {
        await axios.post('http://localhost:9090/api/materials', formData);
      }
      if (onSave) {
        onSave();
      }
      onClose();
    } catch (error) {
      console.error('Error saving material', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        {materialId ? 'Modifica Materiale' : 'Crea Materiale'}
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="code"
        label="Codice"
        name="code"
        autoComplete="code"
        value={formData.code}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Nome"
        name="name"
        autoComplete="name"
        value={formData.name}
        onChange={handleChange}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Salva
      </Button>
      {onClose && (
        <Button fullWidth variant="outlined" onClick={onClose}>
          Chiudi
        </Button>
      )}
    </Box>
  );
};

export default MaterialForm;
