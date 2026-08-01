import { jsPDF } from 'jspdf';
import { format, parseISO } from 'date-fns';
import { Invoice, Contract, BusinessSettings } from './types';
import { formatCurrency } from './utils';

const getBase64ImageFromUrl = async (url: string): Promise<string> => {
  try {
    const res = await fetch(url);
    if (!res.ok) return '';
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    return '';
  }
};

// Colors (Corporate Design Viktor Labs)
const COLOR_PRIMARY = [17, 17, 17];    // #111111 (Schwarz)
const COLOR_ACCENT = [37, 99, 235];    // #2563EB (Blau)
const COLOR_MUTED = [85, 85, 85];      // #555555 (Dunkelgrau)
const COLOR_LINE = [229, 231, 235];    // #E5E7EB (Hellgrau)
const COLOR_BG_HEADER = [249, 250, 251]; // #F9FAFB

export const generateInvoicePDF = async (inv: Invoice, businessSettings: BusinessSettings | null) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.width; // 210mm
  const pageHeight = doc.internal.pageSize.height; // 297mm
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  let logoBase64 = '';
  try {
    logoBase64 = await getBase64ImageFromUrl('/logo.png');
  } catch (e) {
    console.warn("Logo could not be loaded for PDF", e);
  }

  const drawFooter = () => {
    const footerY = pageHeight - 12;
    doc.setLineWidth(0.2);
    doc.setDrawColor(COLOR_LINE[0], COLOR_LINE[1], COLOR_LINE[2]);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
    
    const company = businessSettings?.business_name || 'Viktor Labs';
    doc.text(`${company} · Digital Architecture`, margin, footerY);

    const contactParts = [
      businessSettings?.website || 'www.viktorlabs.de',
      businessSettings?.business_phone || '',
      businessSettings?.business_email || ''
    ].filter(Boolean).join('  ·  ');

    doc.text(contactParts, pageWidth - margin, footerY, { align: 'right' });
  };

  const drawHeaderLine = () => {
    doc.setLineWidth(0.2);
    doc.setDrawColor(COLOR_LINE[0], COLOR_LINE[1], COLOR_LINE[2]);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  };

  // 1. HEADER (Logo & Company Info Left, Meta Info Right)
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', margin, y, 28, 28);
    y += 30;
  } else {
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text('VIKTOR', margin, y + 6);
    const viktorWidth = doc.getTextWidth('VIKTOR ');
    doc.setTextColor(COLOR_ACCENT[0], COLOR_ACCENT[1], COLOR_ACCENT[2]);
    doc.text('LABS', margin + viktorWidth, y + 6);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
    doc.text('DIGITAL ARCHITECTURE', margin, y + 12, { charSpace: 1.5 });
  }

  // Left Contact Details under Logo
  let contactY = y + 18;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');

  const contactList = [
    { label: 'E-Mail:', val: businessSettings?.business_email },
    { label: 'Telefon:', val: businessSettings?.business_phone },
    { label: 'Website:', val: businessSettings?.website },
    { label: 'USt-IdNr.:', val: businessSettings?.vat_id }
  ].filter(item => item.val);

  contactList.forEach(item => {
    doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
    doc.text(item.label, margin, contactY);
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text(item.val!, margin + 20, contactY);
    contactY += 4.5;
  });

  // Right Side Header (Title & Invoice Meta)
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.text('RECHNUNG', pageWidth - margin, y + 6, { align: 'right' });

  let metaY = y + 18;
  const metaItems = [
    ['Rechnungsnummer:', inv.invoice_number || ''],
    ['Rechnungsdatum:', inv.invoice_date ? format(parseISO(inv.invoice_date), 'dd.MM.yyyy') : ''],
    ['Leistungsdatum:', inv.service_date ? format(parseISO(inv.service_date), 'dd.MM.yyyy') : ''],
    ['Zahlungsziel:', `${inv.due_date_days || 14} Tage (${inv.due_date ? format(parseISO(inv.due_date), 'dd.MM.yyyy') : ''})`]
  ];

  metaItems.forEach(([label, val]) => {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
    doc.text(label, pageWidth - 82, metaY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text(val, pageWidth - margin, metaY, { align: 'right' });
    metaY += 4.5;
  });

  y = Math.max(contactY, metaY) + 8;
  drawHeaderLine();

  // 2. RECHNUNGSEMPFÄNGER
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
  doc.text('RECHNUNGSEMPFÄNGER', margin, y, { charSpace: 1 });
  y += 6;

  if (inv.customer_company) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text(inv.customer_company, margin, y);
    y += 5;
  }

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
  if (inv.customer_name) {
    doc.text(inv.customer_name, margin, y);
    y += 4.5;
  }
  if (inv.customer_street) {
    doc.text(inv.customer_street, margin, y);
    y += 4.5;
  }
  if (inv.customer_zip || inv.customer_city) {
    doc.text(`${inv.customer_zip || ''} ${inv.customer_city || ''}`.trim(), margin, y);
    y += 4.5;
  }
  if (inv.customer_country) {
    doc.text(inv.customer_country, margin, y);
    y += 4.5;
  }

  y += 10;

  // 3. POSITIONSTABELLE
  const colPos = margin + 4;
  const colDesc = margin + 18;
  const colQty = pageWidth - 80;
  const colPrice = pageWidth - 50;
  const colTotal = pageWidth - margin - 4;

  // Table Header Block
  doc.setFillColor(COLOR_BG_HEADER[0], COLOR_BG_HEADER[1], COLOR_BG_HEADER[2]);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setLineWidth(0.1);
  doc.setDrawColor(COLOR_LINE[0], COLOR_LINE[1], COLOR_LINE[2]);
  doc.line(margin, y + 8, pageWidth - margin, y + 8);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.text('Pos.', colPos, y + 5.5);
  doc.text('Beschreibung', colDesc, y + 5.5);
  doc.text('Menge', colQty, y + 5.5, { align: 'right' });
  doc.text('Einzelpreis', colPrice, y + 5.5, { align: 'right' });
  doc.text('Gesamt', colTotal, y + 5.5, { align: 'right' });
  y += 12;

  // Items
  doc.setFont('helvetica', 'normal');
  (inv.items || []).forEach((item, i) => {
    const descLines = doc.splitTextToSize(item.description || '', 85);
    const rowHeight = Math.max(8, descLines.length * 4.5 + 4);

    if (y + rowHeight > pageHeight - 40) {
      drawFooter();
      doc.addPage();
      y = margin;
      
      // Redraw Header Block on new page
      doc.setFillColor(COLOR_BG_HEADER[0], COLOR_BG_HEADER[1], COLOR_BG_HEADER[2]);
      doc.rect(margin, y, contentWidth, 8, 'F');
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
      doc.text('Pos.', colPos, y + 5.5);
      doc.text('Beschreibung', colDesc, y + 5.5);
      doc.text('Menge', colQty, y + 5.5, { align: 'right' });
      doc.text('Einzelpreis', colPrice, y + 5.5, { align: 'right' });
      doc.text('Gesamt', colTotal, y + 5.5, { align: 'right' });
      y += 12;
      doc.setFont('helvetica', 'normal');
    }

    doc.setFontSize(9);
    doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
    doc.text((i + 1).toString().padStart(2, '0'), colPos, y + 4);

    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text(descLines, colDesc, y + 4);

    doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
    doc.text(`${item.quantity} ${item.unit || 'Stk'}`, colQty, y + 4, { align: 'right' });
    doc.text(formatCurrency(item.price_per_unit), colPrice, y + 4, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text(formatCurrency(item.total_price), colTotal, y + 4, { align: 'right' });

    y += rowHeight;
    doc.setLineWidth(0.1);
    doc.setDrawColor(COLOR_LINE[0], COLOR_LINE[1], COLOR_LINE[2]);
    doc.line(margin, y - 2, pageWidth - margin, y - 2);
  });

  y += 4;

  // 4. SUMMENBEREICH (Right aligned)
  const totalsX = pageWidth - 80;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
  doc.text('Zwischensumme', totalsX, y);
  doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.text(formatCurrency(inv.subtotal), colTotal, y, { align: 'right' });
  y += 5.5;

  doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
  doc.text(`MwSt. (${inv.vat_rate || 19}%)`, totalsX, y);
  doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.text(formatCurrency(inv.vat_amount), colTotal, y, { align: 'right' });
  y += 7;

  doc.setLineWidth(0.2);
  doc.setDrawColor(COLOR_LINE[0], COLOR_LINE[1], COLOR_LINE[2]);
  doc.line(totalsX, y - 3, pageWidth - margin, y - 3);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.text('GESAMTBETRAG', totalsX, y + 2);

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLOR_ACCENT[0], COLOR_ACCENT[1], COLOR_ACCENT[2]);
  doc.text(formatCurrency(inv.total_amount), colTotal, y + 3, { align: 'right' });

  y += 18;

  // 5. ZAHLUNGSINFORMATIONEN
  if (y > pageHeight - 50) {
    drawFooter();
    doc.addPage();
    y = margin;
  }

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
  doc.text('ZAHLUNGSINFORMATIONEN', margin, y, { charSpace: 1 });
  y += 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  const dueDateStr = inv.due_date ? format(parseISO(inv.due_date), 'dd.MM.yyyy') : '';
  doc.text(`Bitte überweisen Sie den Betrag bis zum ${dueDateStr} auf folgendes Konto:`, margin, y);
  y += 8;

  const colW = contentWidth / 4;
  const drawBankCol = (label: string, val: string, xPos: number) => {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
    doc.text(label.toUpperCase(), xPos, y);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text(val || '-', xPos, y + 5);
  };

  drawBankCol('Bank', businessSettings?.bank_name || 'Volksbank', margin);
  drawBankCol('IBAN', businessSettings?.iban || '', margin + colW);
  drawBankCol('BIC', businessSettings?.bic || '', margin + (colW * 2));
  drawBankCol('Verwendungszweck', inv.invoice_number || '', margin + (colW * 3));

  y += 18;

  // Abschlusstext
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
  doc.text('Vielen Dank für Ihr Vertrauen.', margin, y);
  y += 5;
  doc.text('Mit freundlichen Grüßen', margin, y);
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.text('Viktor Labs', margin, y);

  drawFooter();
  doc.save(`Rechnung_${inv.invoice_number}.pdf`);
};

export const generateContractPDF = async (ct: Contract, businessSettings: BusinessSettings | null) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  let logoBase64 = '';
  try {
    logoBase64 = await getBase64ImageFromUrl('/logo.png');
  } catch (e) {
    console.warn("Logo could not be loaded for PDF", e);
  }

  const drawFooter = () => {
    const footerY = pageHeight - 12;
    doc.setLineWidth(0.2);
    doc.setDrawColor(COLOR_LINE[0], COLOR_LINE[1], COLOR_LINE[2]);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
    
    const company = businessSettings?.business_name || 'Viktor Labs';
    doc.text(`${company} · Digital Architecture`, margin, footerY);

    const contactParts = [
      businessSettings?.website || 'www.viktorlabs.de',
      businessSettings?.business_phone || '',
      businessSettings?.business_email || ''
    ].filter(Boolean).join('  ·  ');

    doc.text(contactParts, pageWidth - margin, footerY, { align: 'right' });
  };

  const drawHeaderLine = () => {
    doc.setLineWidth(0.2);
    doc.setDrawColor(COLOR_LINE[0], COLOR_LINE[1], COLOR_LINE[2]);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  };

  const addSection = (title: string, content: string) => {
    if (!content) return;
    if (y > pageHeight - 40) {
      drawFooter();
      doc.addPage();
      y = margin;
    }

    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text(title, margin, y);
    y += 5;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
    
    const splitContent = doc.splitTextToSize(content, contentWidth);
    splitContent.forEach((lineText: string) => {
      if (y > pageHeight - 25) {
        drawFooter();
        doc.addPage();
        y = margin;
      }
      doc.text(lineText, margin, y);
      y += 4.5;
    });

    y += 6;
  };

  // 1. HEADER
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', margin, y, 28, 28);
    y += 30;
  } else {
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text('VIKTOR', margin, y + 6);
    const viktorWidth = doc.getTextWidth('VIKTOR ');
    doc.setTextColor(COLOR_ACCENT[0], COLOR_ACCENT[1], COLOR_ACCENT[2]);
    doc.text('LABS', margin + viktorWidth, y + 6);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
    doc.text('DIGITAL ARCHITECTURE', margin, y + 12, { charSpace: 1.5 });
  }

  // Left Contact Info
  let contactY = y + 18;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');

  const contactList = [
    { label: 'E-Mail:', val: businessSettings?.business_email },
    { label: 'Telefon:', val: businessSettings?.business_phone },
    { label: 'Website:', val: businessSettings?.website },
    { label: 'USt-IdNr.:', val: businessSettings?.vat_id }
  ].filter(item => item.val);

  contactList.forEach(item => {
    doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
    doc.text(item.label, margin, contactY);
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text(item.val!, margin + 20, contactY);
    contactY += 4.5;
  });

  // Right Side Title & Contract Meta
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.text('VERTRAGSBEILAGE', pageWidth - margin, y + 6, { align: 'right' });

  let metaY = y + 18;
  const metaItems = [
    ['Vertragsnummer:', ct.contract_number || ''],
    ['Vertragsdatum:', ct.contract_date ? format(parseISO(ct.contract_date), 'dd.MM.yyyy') : ''],
    ['Vertragsbeginn:', ct.start_date ? format(parseISO(ct.start_date), 'dd.MM.yyyy') : ''],
    ['Projekt:', ct.project_name || '']
  ];

  metaItems.forEach(([label, val]) => {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
    doc.text(label, pageWidth - 82, metaY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text(val, pageWidth - margin, metaY, { align: 'right' });
    metaY += 4.5;
  });

  y = Math.max(contactY, metaY) + 8;
  drawHeaderLine();

  // 2. VERTRAGSPARTNER (AUFTRAGNEHMER vs AUFTRAGGEBER)
  const colHalf = contentWidth / 2;
  
  // Left: Auftragnehmer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
  doc.text('AUFTRAGNEHMER', margin, y, { charSpace: 1 });
  
  // Right: Auftraggeber
  doc.text('AUFTRAGGEBER', margin + colHalf + 5, y, { charSpace: 1 });
  y += 6;

  // Left Details
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.text(businessSettings?.business_name || 'Viktor Labs', margin, y);

  // Right Details
  doc.text(ct.customer_company || ct.customer_name || 'Kunde', margin + colHalf + 5, y);
  y += 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);

  let leftY = y;
  let rightY = y;

  // Left body
  doc.text('Digital Architecture', margin, leftY); leftY += 4.5;
  if (businessSettings?.business_email) { doc.text(businessSettings.business_email, margin, leftY); leftY += 4.5; }
  if (businessSettings?.vat_id) { doc.text(`USt-ID: ${businessSettings.vat_id}`, margin, leftY); leftY += 4.5; }

  // Right body
  if (ct.customer_name && ct.customer_company) { doc.text(ct.customer_name, margin + colHalf + 5, rightY); rightY += 4.5; }
  if (ct.customer_street) { doc.text(ct.customer_street, margin + colHalf + 5, rightY); rightY += 4.5; }
  if (ct.customer_zip || ct.customer_city) { doc.text(`${ct.customer_zip || ''} ${ct.customer_city || ''}`.trim(), margin + colHalf + 5, rightY); rightY += 4.5; }
  if (ct.customer_country) { doc.text(ct.customer_country, margin + colHalf + 5, rightY); rightY += 4.5; }

  y = Math.max(leftY, rightY) + 8;
  drawHeaderLine();

  // 3. SECTIONS
  addSection('1. Gegenstand des Vertrags', ct.description);
  addSection('2. Leistungsumfang', ct.scope);
  addSection('3. Zeitplan & Projektablauf', ct.timeline);
  addSection('4. Vergütung & Zahlungsbedingungen', ct.payment_terms);

  if (ct.total_price) {
    if (y > pageHeight - 35) {
      drawFooter();
      doc.addPage();
      y = margin;
    }
    doc.setLineWidth(0.2);
    doc.setDrawColor(COLOR_LINE[0], COLOR_LINE[1], COLOR_LINE[2]);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text('GESAMTINVESTITION', margin, y);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLOR_ACCENT[0], COLOR_ACCENT[1], COLOR_ACCENT[2]);
    doc.text(formatCurrency(ct.total_price), pageWidth - margin, y, { align: 'right' });
    y += 10;
  }

  addSection('5. Mitwirkungspflichten des Auftraggebers', ct.responsibilities);
  addSection('6. Lieferumfang', ct.deliverables);
  addSection('7. Gewährleistung & Haftung', ct.warranty);
  addSection('8. Schlussbestimmungen', ct.other_agreements);

  // 4. UNTERSCHRIFTEN
  if (y > pageHeight - 50) {
    drawFooter();
    doc.addPage();
    y = margin;
  }

  y += 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
  doc.text('UNTERSCHRIFTEN & BESTÄTIGUNG', margin, y, { charSpace: 1 });
  y += 12;

  const sigWidth = 70;
  // Left signature
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
  doc.text('Ort, Datum:', margin, y);
  doc.line(margin + 20, y, margin + sigWidth, y);

  doc.text('Ort, Datum:', margin + colHalf + 5, y);
  doc.line(margin + colHalf + 25, y, margin + colHalf + 5 + sigWidth, y);

  y += 20;

  // Signature lines
  doc.setLineWidth(0.3);
  doc.setDrawColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.line(margin, y, margin + sigWidth, y);
  doc.line(margin + colHalf + 5, y, margin + colHalf + 5 + sigWidth, y);

  y += 5;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.text(businessSettings?.business_name || 'Viktor Labs (Auftragnehmer)', margin, y);
  doc.text(`${ct.customer_company || ct.customer_name || 'Kunde'} (Auftraggeber)`, margin + colHalf + 5, y);

  drawFooter();
  doc.save(`Vertrag_${ct.contract_number}.pdf`);
};
