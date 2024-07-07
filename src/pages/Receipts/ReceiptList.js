import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Delete, Save } from '@mui/icons-material';
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

  const calculateRemainingAmount = (receipt) => {
    const amounts = [receipt.amount, receipt.amount2, receipt.amount3, receipt.amount4, receipt.amount5];
    const paidAmount = amounts.filter(Boolean).reduce((acc, curr) => acc + curr, 0);
    return receipt.totalPrice - paidAmount;
  };

  const formatCurrency = (amount) => {
    return `€ ${amount.toFixed(2).replace('.', ',')}`;
  };

  const generatePDF = (receipt) => {
    const doc = new jsPDF();
    const user = receipt.user || {};
    const material = receipt.material || {};
    const formattedDate = new Date(receipt.date).toLocaleDateString();
    const dueDate = new Date(receipt.dueDate).toLocaleDateString();
    const remainingAmount = calculateRemainingAmount(receipt);
  
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
      body: [[user.firstName + ' ' + user.lastName, user.codiceFiscale, new Date(user.birthDate).toLocaleDateString(), user.birthPlace, user.residenza]]
    });
  
    doc.setFontSize(12);
    doc.text("DICHIARA", 10, doc.autoTable.previous.finalY + 5);
  
    doc.setFontSize(10);
    doc.text(`Di vendere in qualità di privato, alla ditta BEVILACQUA FRANCESCO con sede in Cosenza`, 10, doc.autoTable.previous.finalY + 15);
    doc.text(`Partita IVA 03784660783 esercente la vendita all'ingrosso di "Rottami Metallici"`, 10, doc.autoTable.previous.finalY + 20);
    doc.text(`quanto segue:`, 10, doc.autoTable.previous.finalY + 25);
  
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 30,
      head: [['QUANTITA\'', 'Codice FIR', 'MATERIALE', 'CODICE MATERIALE', 'TIPO DI PAGAMENTO', 'PREZZO UNITARIO', 'IMPORTO']],
      body: [[`${receipt.quantity} kg`, receipt.description, material.name, material.code, receipt.paymentType, formatCurrency(receipt.unitPrice), formatCurrency(receipt.amount)]]
    });
  
    const payments = [];
    if (receipt.amount2) payments.push(['Pagamento 2', formatCurrency(receipt.amount2), receipt.paymentType2, new Date(receipt.dueDate2).toLocaleDateString()]);
    if (receipt.amount3) payments.push(['Pagamento 3', formatCurrency(receipt.amount3), receipt.paymentType3, new Date(receipt.dueDate3).toLocaleDateString()]);
    if (receipt.amount4) payments.push(['Pagamento 4', formatCurrency(receipt.amount4), receipt.paymentType4, new Date(receipt.dueDate4).toLocaleDateString()]);
    if (receipt.amount5) payments.push(['Pagamento 5', formatCurrency(receipt.amount5), receipt.paymentType5, new Date(receipt.dueDate5).toLocaleDateString()]);
  
    if (payments.length > 0) {
      doc.autoTable({
        startY: doc.autoTable.previous.finalY + 5,
        head: [['Pagamento', 'Importo', 'Tipo di Pagamento', 'Data del Saldo']],
        body: payments
      });
  
      doc.text(`PER UN VALORE COMPLESSIVO DI ${formatCurrency(receipt.totalPrice)}`, 10, doc.autoTable.previous.finalY + 10);
      doc.text(`Per conferma`, 10, doc.autoTable.previous.finalY + 20);
      doc.text(` ${new Date().toLocaleDateString()}`, 10, doc.autoTable.previous.finalY + 25);
      doc.text("in Fede", 10, doc.autoTable.previous.finalY + 30);
      doc.text("Ricevuta rilasciata fuori campo di applicazione dell'IVA di cui al D.P.R. N° 633 del 26.10.72", 10, doc.autoTable.previous.finalY + 40);
      doc.text("e successive modificazioni in quanto da privato", 10, doc.autoTable.previous.finalY + 45);
    }
  
    doc.save(`ricevuta_${receipt.receiptNumber}.pdf`);
  };
  

  const generateExcel = (receipt) => {
    const user = receipt.user || {};
    const material = receipt.material || {};
    const remainingAmount = calculateRemainingAmount(receipt);

    const data = [
      ['Numero Ricevuta', receipt.receiptNumber],
      ['Nome Utente', `${user.firstName} ${user.lastName}`],
      ['Codice Fiscale', user.codiceFiscale],
      ['Data di Nascita', new Date(user.birthDate).toLocaleDateString()],
      ['Luogo di Nascita', user.birthPlace],
      ['Residenza', user.residenza],
      ['Materiale', material.name],
      ['Codice Materiale', material.code],
      ['Codice FIR', receipt.description],
      ['Quantità', `${receipt.quantity} kg`],
      ['Prezzo Unitario', formatCurrency(receipt.unitPrice)],
      ['Prezzo Totale', formatCurrency(receipt.totalPrice)],
      ['Importo dato', formatCurrency(receipt.amount)],
      ['Tipo di Pagamento', receipt.paymentType],
      ['Data', new Date(receipt.date).toLocaleDateString()], // Utilizzo solo toLocaleDateString() per ottenere giorno, mese e anno
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
                  <div><b>Utente:</b> {receipt.user ? `${receipt.user.firstName} ${receipt.user.lastName}` : 'Sconosciuto'}</div>
                  <div><b>Codice Fiscale:</b> {receipt.user ? receipt.user.codiceFiscale : 'Sconosciuto'}</div>
                  <div><b>Data di Nascita:</b> {receipt.user ? new Date(receipt.user.birthDate).toLocaleDateString() : 'Sconosciuto'}</div>
                  <div><b>Luogo di Nascita:</b> {receipt.user ? receipt.user.birthPlace : 'Sconosciuto'}</div>
                  <div><b>Residenza:</b> {receipt.user ? receipt.user.residenza : 'Sconosciuto'}</div>
                  <div><b>Materiale:</b> {receipt.material ? receipt.material.name : 'Sconosciuto'}</div>
                  <div><b>Codice Materiale:</b> {receipt.material ? receipt.material.code : 'Sconosciuto'}</div>
                  <div><b>Codice FIR:</b> {receipt.description}</div>
                  <div><b>Quantità:</b> {`${receipt.quantity} kg`}</div>
                  <div><b>Prezzo Unitario:</b> {formatCurrency(receipt.unitPrice)}</div>
                  <div><b>Prezzo Totale:</b> {formatCurrency(receipt.totalPrice)}</div>
                  <div><b>Importo dato:</b> {formatCurrency(receipt.amount)}</div>
                  <div><b>Tipo di Pagamento:</b> {receipt.paymentType}</div>
                  <div><b>Data del Saldo:</b> {new Date(receipt.dueDate).toLocaleDateString()}</div>
                  <div><b>Data:</b> {new Date(receipt.date).toLocaleDateString()}</div>
                  {receipt.amount2 && (
                    <>
                      <div><b>Pagamento 2:</b></div>
                      <div>Importo: {formatCurrency(receipt.amount2)}</div>
                      <div>Tipo di Pagamento: {receipt.paymentType2}</div>
                      <div>Data del saldo: {new Date(receipt.dueDate2).toLocaleDateString()}</div>
                    </>
                  )}
                  {receipt.amount3 && (
                    <>
                      <div><b>Pagamento 3:</b></div>
                      <div>Importo: {formatCurrency(receipt.amount3)}</div>
                      <div>Tipo di Pagamento: {receipt.paymentType3}</div>
                      <div>Data del saldo: {new Date(receipt.dueDate3).toLocaleDateString()}</div>
                    </>
                  )}
                  {receipt.amount4 && (
                    <>
                      <div><b>Pagamento 4:</b></div>
                      <div>Importo: {formatCurrency(receipt.amount4)}</div>
                      <div>Tipo di Pagamento: {receipt.paymentType4}</div>
                      <div>Data del saldo: {new Date(receipt.dueDate4).toLocaleDateString()}</div>
                    </>
                  )}
                  {receipt.amount5 && (
                    <>
                      <div><b>Pagamento 5:</b></div>
                      <div>Importo: {formatCurrency(receipt.amount5)}</div>
                      <div>Tipo di Pagamento: {receipt.paymentType5}</div>
                      <div>Data del saldo: {new Date(receipt.dueDate5).toLocaleDateString()}</div>
                    </>
                  )}
                  <div><b>Quota Rimanente:</b> {formatCurrency(calculateRemainingAmount(receipt))}</div>
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
