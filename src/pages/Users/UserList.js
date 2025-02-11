import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const UserList = ({ onEdit }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:9090/api/users');
      setUsers(response.data || []);
      setFilteredUsers(response.data || []);
    } catch (error) {
      console.error('Errore nel recupero degli utenti', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9090/api/users/${id}`);
      fetchUsers(); // Refresh the list after deletion
      setDeleteUserId(null);
    } catch (error) {
      console.error('Errore nella cancellazione dell\'utente', error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteUserId(id);
  };

  const closeDialog = () => {
    setDeleteUserId(null);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredUsers(users.filter(user => 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(term)
    ));
  };

  return (
    <>
      <TextField
        label="Cerca Utente"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        margin="normal"
      />
      <List>
        {filteredUsers.map((user) => (
          <ListItem key={user.id}>
            <ListItemText
              primary={`${user.firstName} ${user.lastName}`}
              secondary={`Luogo di nascita: ${user.birthPlace}, Data di nascita: ${new Date(user.birthDate).toLocaleDateString()}, Codice Fiscale: ${user.codiceFiscale}, Residenza: ${user.residenza}`}
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
