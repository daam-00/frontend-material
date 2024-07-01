import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const MaterialList = ({ onEdit }) => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [deleteMaterialId, setDeleteMaterialId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get('http://localhost:9090/api/materials');
      setMaterials(response.data || []);
      setFilteredMaterials(response.data || []);
    } catch (error) {
      console.error('Errore nel recupero dei materiali', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9090/api/materials/${id}`);
      fetchMaterials(); // Refresh the list after deletion
      setDeleteMaterialId(null);
    } catch (error) {
      console.error('Errore nella cancellazione del materiale', error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteMaterialId(id);
  };

  const closeDialog = () => {
    setDeleteMaterialId(null);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredMaterials(materials.filter(material =>
      material.name.toLowerCase().includes(term)
    ));
  };

  return (
    <>
      <TextField
        label="Cerca Materiale"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        margin="normal"
      />
      <List>
        {filteredMaterials.map((material) => (
          <ListItem key={material.id}>
            <ListItemText
              primary={material.name}
              secondary={`Codice: ${material.code}`}
            />
            <IconButton edge="end" onClick={() => onEdit(material.id)}>
              <Edit />
            </IconButton>
            <IconButton edge="end" onClick={() => confirmDelete(material.id)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Dialog open={Boolean(deleteMaterialId)} onClose={closeDialog}>
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>Sei sicuro di voler eliminare questo materiale?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Annulla</Button>
          <Button onClick={() => handleDelete(deleteMaterialId)} color="secondary">Elimina</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MaterialList;