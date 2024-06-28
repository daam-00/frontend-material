import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const UserList = ({ onEdit }) => {
  const [users, setUsers] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:9090/api/users');
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9090/api/users/${id}`);
      fetchUsers(); // Refresh the list after deletion
      setDeleteUserId(null);
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteUserId(id);
  };

  const closeDialog = () => {
    setDeleteUserId(null);
  };

  return (
    <>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemText
                       primary={`${user.firstName} ${user.lastName}`}
                       secondary={`Birth Place: ${user.birthPlace}, Birth Date: ${new Date(user.birthDate).toLocaleDateString()}, Codice Fiscale: ${user.codiceFiscale}, Residenza: ${user.residenza}`}
            />
            <IconButton edge="end" onClick={() => onEdit(user.id)}>
              <Edit />
            </IconButton>
            <IconButton edge="end" onClick={() => confirmDelete(user.id)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Dialog open={Boolean(deleteUserId)} onClose={closeDialog}>
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>Sei sicuro di voler eliminare questo utente?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Annulla</Button>
          <Button onClick={() => handleDelete(deleteUserId)} color="secondary">Elimina</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserList;
