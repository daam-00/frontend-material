import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Delete, Save, Description } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ReceiptList = ({ searchQuery }) => {
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
      console.error('Errore durante il recupero delle ricevute', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9090/api/receipts/${id}`);
      fetchReceipts(); // Aggiorna l'elenco dopo l'eliminazione
      setDeleteReceiptId(null);
    } catch (error) {
      console.error('Errore durante l\'eliminazione della ricevuta', error);
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
    const dueDate = new Date(receipt.dueDate).toLocaleDateString();

    doc.setFontSize(10);
    doc.text("REGISTRO METALLI", 10, 10);
    doc.text("BEVILACQUA FRANCESCO", 10, 15);
    doc.text("Via A. Urso, 32 - 87100 Cosenza", 10, 20);
    doc.text("Cod. Fiscale: BVL FNC 93L30 D086H", 10, 25);
    doc.text("Partita IVA: 03784660783", 10, 30);
    doc.text("N. Iscr. CZ 06810 del 11/09/2023", 10, 35);

    doc.setFontSize(12);
    doc.text("Dichiarazione di vendita da privato", 10, 45);
    doc.text(`N. ${receipt.receiptNumber}`, 150, 45);
    doc.text(`Data ${formattedDate}`, 150, 50);

    doc.autoTable({
      startY: 55,
      head: [['Utente', 'Codice Fiscale', 'Data di Nascita', 'Luogo di Nascita', 'Residenza']],
      body: [[`${user.firstName} ${user.lastName}`, user.codiceFiscale, new Date(user.birthDate).toLocaleDateString(), user.birthPlace, user.residenza]]
    });

    doc.setFontSize(12);
    doc.text("DICHIARA", 10, doc.autoTable.previous.finalY + 10);

    doc.setFontSize(10);
    doc.text(`Di vendere in qualità di privato, alla ditta BEVILACQUA FRANCESCO con sede in Cosenza`, 10, doc.autoTable.previous.finalY + 20);
    doc.text(`Partita IVA 03784660783 esercente la vendita all'ingrosso di "Rottami Metallici"`, 10, doc.autoTable.previous.finalY + 25);
    doc.text(`quanto segue:`, 10, doc.autoTable.previous.finalY + 30);

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 35,
      head: [['QUANTITA\'', 'DESCRIZIONE', 'MATERIALE', 'PREZZO UNITARIO', 'IMPORTO']],
      body: [[receipt.quantity, receipt.description, material.name, receipt.unitPrice, receipt.amount]]
    });

    doc.text(`PER UN VALORE COMPLESSIVO DI € ${receipt.totalPrice}`, 10, doc.autoTable.previous.finalY + 10);
    doc.text(`Data di scadenza: ${dueDate}`, 10, doc.autoTable.previous.finalY + 20);

    doc.text(`Il confermo tutto sopra`, 10, doc.autoTable.previous.finalY + 30);
    doc.text(`Li ${new Date().toLocaleDateString()}`, 10, doc.autoTable.previous.finalY + 35);
    doc.text("in Fede", 10, doc.autoTable.previous.finalY + 40);
    doc.text("Ricevuta rilasciata fuori campo di applicazione dell'IVA di cui al D.P.R. N° 633 del 26.10.72", 10, doc.autoTable.previous.finalY + 50);
    doc.text("e successive modificazioni in quanto da privato", 10, doc.autoTable.previous.finalY + 55);

    doc.save(`ricevuta_${receipt.receiptNumber}.pdf`);
  };

  const generateExcel = (receipt) => {
    const user = receipt.user || {};
    const material = receipt.material || {};

    const data = [
      ['Numero Ricevuta', receipt.receiptNumber],
      ['Nome Utente', `${user.firstName} ${user.lastName}`],
      ['Codice Fiscale', user.codiceFiscale],
      ['Data di Nascita', new Date(user.birthDate).toLocaleDateString()],
      ['Luogo di Nascita', user.birthPlace],
      ['Residenza', user.residenza],
      ['Materiale', material.name],
      ['Codice Materiale', material.code],
      ['Descrizione', receipt.description],
      ['Quantità', receipt.quantity],
      ['Prezzo Unitario', receipt.unitPrice],
      ['Prezzo Totale', receipt.totalPrice],
      ['Tipo di Pagamento', receipt.paymentType],
      ['Data di Scadenza', new Date(receipt.dueDate).toLocaleDateString()],
      ['Data', new Date(receipt.date).toLocaleString()],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Ricevuta_${receipt.receiptNumber}`);
    XLSX.writeFile(workbook, `ricevuta_${receipt.receiptNumber}.xlsx`);
  };

  const filteredReceipts = receipts.filter(receipt => {
    const receiptNumberMatch = receipt.receiptNumber.toString().includes(searchQuery);
    const userNameMatch = receipt.user && `${receipt.user.firstName} ${receipt.user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    return receiptNumberMatch || userNameMatch;
  });

  return (
    <>
      <List>
        {filteredReceipts.map((receipt) => (
          <ListItem key={receipt.id}>
            <ListItemText
              primary={`Ricevuta #${receipt.receiptNumber}`}
              secondary={
                <>
                  <div>Utente: {receipt.user ? `${receipt.user.firstName} ${receipt.user.lastName}` : 'Sconosciuto'}</div>
                  <div>Codice Fiscale: {receipt.user ? receipt.user.codiceFiscale : 'Sconosciuto'}</div>
                  <div>Data di Nascita: {receipt.user ? new Date(receipt.user.birthDate).toLocaleDateString() : 'Sconosciuto'}</div>
                  <div>Luogo di Nascita: {receipt.user ? receipt.user.birthPlace : 'Sconosciuto'}</div>
                  <div>Residenza: {receipt.user ? receipt.user.residenza : 'Sconosciuto'}</div>
                  <div>Materiale: {receipt.material ? receipt.material.name : 'Sconosciuto'}</div>
                  <div>Codice Materiale: {receipt.material ? receipt.material.code : 'Sconosciuto'}</div>
                  <div>Descrizione: {receipt.description}</div>
                  <div>Quantità: {receipt.quantity}</div>
                  <div>Prezzo Unitario: {receipt.unitPrice}</div>
                  <div>Prezzo Totale: {receipt.totalPrice}</div>
                  <div>Importo dato: {receipt.amount}</div>
                  <div>Tipo di Pagamento: {receipt.paymentType}</div>
                  <div>Data di Scadenza: {new Date(receipt.dueDate).toLocaleDateString()}</div>
                  <div>Data: {new Date(receipt.date).toLocaleString()}</div>
                </>
              }
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
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>Sei sicuro di voler eliminare questa ricevuta?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancella</Button>
          <Button onClick={() => handleDelete(deleteReceiptId)} color="secondary">Elimina</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReceiptList;
