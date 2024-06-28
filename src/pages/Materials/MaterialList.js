import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const MaterialList = ({ onEdit }) => {
  const [materials, setMaterials] = useState([]);
  const [deleteMaterialId, setDeleteMaterialId] = useState(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get('http://localhost:9090/api/materials');
      setMaterials(response.data || []);
    } catch (error) {
      console.error('Error fetching materials', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9090/api/materials/${id}`);
      fetchMaterials(); // Refresh the list after deletion
      setDeleteMaterialId(null);
    } catch (error) {
      console.error('Error deleting material', error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteMaterialId(id);
  };

  const closeDialog = () => {
    setDeleteMaterialId(null);
  };

  return (
    <>
      <List>
        {materials.map((material) => (
          <ListItem key={material.id}>
            <ListItemText
              primary={material.name}
              secondary={`Code: ${material.code}`}
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
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this material?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={() => handleDelete(deleteMaterialId)} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MaterialList;
