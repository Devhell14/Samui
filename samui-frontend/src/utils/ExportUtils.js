import jsPDF from 'jspdf';

// ทดสอบการใช้ Plugin Download PDF
const downloadProductBalancePDF = () => {
    const doc = new jsPDF();
    doc.text('TEST Export ProductBalanc By SpriteZadis', 10, 10);
    doc.save('product_balance.pdf');
};

// ทดสอบการใช้ Plugin Download PDF
const downloadWarehouseProductsPDF = () => {
    const doc = new jsPDF();
    doc.text('TEST Export WarehouseProducts By SpriteZadis', 10, 10);
    doc.save('warehouse_products.pdf');
};

// ทดสอบการใช้ Plugin Download PDF
const downloadReconciliationPDF = () => {
    const doc = new jsPDF();
    doc.text('TEST Export Reconciliation By SpriteZadis', 10, 10);
    doc.save('reconciliation.pdf');
};

export {
    downloadProductBalancePDF,
    downloadWarehouseProductsPDF,
    downloadReconciliationPDF
};