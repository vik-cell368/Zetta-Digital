import { jsPDF } from 'jspdf';
import { format, parseISO } from 'date-fns';
import { Invoice, Contract, BusinessSettings } from './types';
import { formatCurrency } from './utils';

const getBase64ImageFromUrl = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const generateInvoicePDF = async (inv: Invoice, businessSettings: BusinessSettings | null) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let y = margin;

  let logoBase64 = '';
  try {
    logoBase64 = await getBase64ImageFromUrl('/logo.png');
  } catch (e) {
    console.warn("Logo could not be loaded for PDF", e);
  }

  const line = (thickness = 0.2, color = [0, 0, 0]) => {
    doc.setLineWidth(thickness);
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  // 1. Header (Logo & Company Info)
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', margin, y, 30, 30);
    y += 5;
  } else {
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('VIKTOR', margin, y + 10);
    const viktorWidth = doc.getTextWidth('VIKTOR ');
    doc.setTextColor(59, 130, 246); 
    doc.text('LABS', margin + viktorWidth, y + 10);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('DIGITAL ARCHITECTURE', margin, y + 15, { charSpace: 2 });
    y += 20;
  }

  // Left Contact Info
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  const contactX = margin;
  let contactY = y + 10;
  
  const contactDetails = [
    { label: 'E-Mail:', value: businessSettings?.business_email || '' },
    { label: 'Tel:', value: businessSettings?.business_phone || '' },
    { label: 'Web:', value: businessSettings?.website || '' },
    { label: 'USt-IdNr:', value: businessSettings?.vat_id || '' }
  ];

  contactDetails.forEach(detail => {
    if (detail.value) {
      doc.text(detail.label, contactX, contactY);
      doc.text(detail.value, contactX + 20, contactY);
      contactY += 6;
    }
  });

  // Right Meta Info
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('RECHNUNG', pageWidth - margin, y + 10, { align: 'right' });
  
  let metaY = y + 25;
  doc.setFontSize(9);
  const metaLabels = [
    ['Rechnungsnummer:', inv.invoice_number],
    ['Datum:', format(parseISO(inv.invoice_date), 'dd.MM.yyyy')],
    ['Leistungsdatum:', format(parseISO(inv.service_date), 'dd.MM.yyyy')],
    ['Zahlungsziel:', `${inv.due_date_days} Tage (${format(parseISO(inv.due_date), 'dd.MM.yyyy')})`]
  ];

  metaLabels.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.text(label, pageWidth - 80, metaY);
    doc.setFont('helvetica', 'bold');
    doc.text(value, pageWidth - margin, metaY, { align: 'right' });
    metaY += 6;
  });

  y = Math.max(contactY, metaY) + 10;
  line(0.1, [200, 200, 200]);

  // 2. Customer Info
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('RECHNUNGSEMPFÄNGER', margin, y);
  y += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(inv.customer_company || '', margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (inv.customer_name) {
    doc.text(inv.customer_name, margin, y);
    y += 5;
  }
  doc.text(inv.customer_street || '', margin, y);
  y += 5;
  doc.text(`${inv.customer_zip || ''} ${inv.customer_city || ''}`, margin, y);
  y += 5;
  doc.text(inv.customer_country || '', margin, y);
  y += 20;

  // 3. Table Header
  doc.setFillColor(249, 250, 251);
  doc.rect(margin, y, pageWidth - (margin * 2), 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Pos.', margin + 5, y + 6);
  doc.text('Beschreibung', margin + 25, y + 6);
  doc.text('Menge', pageWidth - 85, y + 6, { align: 'right' });
  doc.text('Einzelpreis', pageWidth - 50, y + 6, { align: 'right' });
  doc.text('Gesamt', pageWidth - margin - 5, y + 6, { align: 'right' });
  y += 10;

  // Items
  doc.setFont('helvetica', 'normal');
  inv.items.forEach((item, i) => {
    const descLines = doc.splitTextToSize(item.description, 80);
    const rowHeight = Math.max(10, (descLines.length * 5) + 5);
    
    doc.setDrawColor(243, 244, 246);
    doc.line(margin, y, pageWidth - margin, y);
    
    doc.text((i + 1).toString(), margin + 5, y + 7);
    doc.text(descLines, margin + 25, y + 7);
    doc.text(`${item.quantity} ${item.unit}`, pageWidth - 85, y + 7, { align: 'right' });
    doc.text(formatCurrency(item.price_per_unit), pageWidth - 50, y + 7, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(item.total_price), pageWidth - margin - 5, y + 7, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    
    y += rowHeight;
    
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
  });

  line(0.1, [200, 200, 200]);
  y -= 5;

  // 4. Totals
  const totalsX = pageWidth - 80;
  doc.setFontSize(9);
  doc.text('Zwischensumme', totalsX, y);
  doc.text(formatCurrency(inv.subtotal), pageWidth - margin - 5, y, { align: 'right' });
  y += 6;
  doc.text(`MwSt. (${inv.vat_rate}%)`, totalsX, y);
  doc.text(formatCurrency(inv.vat_amount), pageWidth - margin - 5, y, { align: 'right' });
  y += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Gesamtbetrag', totalsX, y);
  doc.setFontSize(16);
  doc.text(formatCurrency(inv.total_amount), pageWidth - margin - 5, y, { align: 'right' });
  y += 15;

  line(0.1, [230, 230, 230]);

  // 5. Payment Info
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('ZAHLUNGSINFORMATIONEN', margin, y);
  y += 8;
  
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text(`Bitte überweisen Sie den Betrag bis zum ${format(parseISO(inv.due_date), 'dd.MM.yyyy')} auf folgendes Konto:`, margin, y);
  y += 10;

  const colWidth = (pageWidth - (margin * 2)) / 4;
  const drawBankDetail = (label: string, value: string, x: number) => {
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(label, x, y);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(value, x, y + 6);
    doc.setDrawColor(229, 231, 235);
    doc.line(x + colWidth - 5, y, x + colWidth - 5, y + 8);
  };

  drawBankDetail('Bank', businessSettings?.bank_name || '', margin);
  drawBankDetail('IBAN', businessSettings?.iban || '', margin + colWidth);
  drawBankDetail('BIC', businessSettings?.bic || '', margin + (colWidth * 2));
  drawBankDetail('Verwendungszweck', inv.invoice_number, margin + (colWidth * 3));
  
  y += 25;
  line(0.1, [230, 230, 230]);

  // 6. Footer
  const footerY = doc.internal.pageSize.height - 10;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(businessSettings?.business_name || 'Viktor Labs', margin, footerY);
  const labWidth = doc.getTextWidth(businessSettings?.business_name || 'Viktor Labs');
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(' · Digital Architecture', margin + labWidth, footerY);

  doc.text(businessSettings?.website || '', pageWidth / 2 + 10, footerY, { align: 'right' });
  doc.text(businessSettings?.business_phone || '', pageWidth / 2 + 50, footerY, { align: 'right' });
  doc.text(businessSettings?.business_email || '', pageWidth - margin, footerY, { align: 'right' });

  doc.save(`Rechnung_${inv.invoice_number}.pdf`);
};

export const generateContractPDF = async (ct: Contract, businessSettings: BusinessSettings | null) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let y = margin;

  let logoBase64 = '';
  try {
    logoBase64 = await getBase64ImageFromUrl('/logo.png');
  } catch (e) {
    console.warn("Logo could not be loaded for PDF", e);
  }

  const line = (thickness = 0.2, color = [0, 0, 0]) => {
    doc.setLineWidth(thickness);
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  const addSection = (title: string, content: string) => {
    if (!content) return;
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const splitContent = doc.splitTextToSize(content, pageWidth - (margin * 2));
    doc.text(splitContent, margin, y);
    y += (splitContent.length * 5) + 10;
  };

  // 1. Header
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', margin, y, 30, 30);
    y += 5;
  } else {
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('VIKTOR', margin, y + 10);
    const viktorWidth = doc.getTextWidth('VIKTOR ');
    doc.setTextColor(59, 130, 246);
    doc.text('LABS', margin + viktorWidth, y + 10);
    y += 20;
  }

  // Meta Info
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('VERTRAGSBEILAGE', pageWidth - margin, y + 10, { align: 'right' });
  
  let metaY = y + 25;
  doc.setFontSize(9);
  const metaLabels = [
    ['Vertragsnummer:', ct.contract_number],
    ['Datum:', format(parseISO(ct.contract_date), 'dd.MM.yyyy')],
    ['Projekt:', ct.project_name]
  ];

  metaLabels.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.text(label, pageWidth - 80, metaY);
    doc.setFont('helvetica', 'bold');
    doc.text(value || '', pageWidth - margin, metaY, { align: 'right' });
    metaY += 6;
  });

  y = Math.max(y + 40, metaY) + 10;
  line(0.1, [200, 200, 200]);

  // 2. Parties
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Auftragnehmer:', margin, y);
  doc.text('Auftraggeber:', pageWidth - 80, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(businessSettings?.business_name || 'Viktor Labs', margin, y);
  doc.text(ct.customer_company || '', pageWidth - 80, y);
  y += 20;
  line(0.1, [200, 200, 200]);

  // 3. Sections
  addSection('1. Gegenstand der Beilage', ct.description);
  addSection('2. Leistungsumfang', ct.scope);
  addSection('3. Zeitplan & Ablauf', ct.timeline);
  addSection('4. Vergütung & Zahlungsbedingungen', ct.payment_terms);
  addSection('5. Mitwirkungspflichten', ct.responsibilities);
  addSection('6. Lieferumfang', ct.deliverables);

  if (ct.total_price) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`Investition: ${formatCurrency(ct.total_price)}`, margin, y);
    y += 15;
  }

  addSection('7. Gewährleistung', ct.warranty);
  addSection('8. Schlussbestimmungen', ct.other_agreements);

  // 4. Footer
  const footerY = doc.internal.pageSize.height - 10;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(businessSettings?.business_name || 'Viktor Labs', margin, footerY);
  doc.save(`Vertrag_${ct.contract_number}.pdf`);
};
