import jsPDF from "jspdf";

interface Purchase {
  courseName: string;
  price: number;
  purchasedAt: string;
}

export const exportToPDF = (p: Purchase) => {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Purchase Details", 20, 20);

  doc.setFontSize(10);
  doc.text(`Course: ${p.courseName}`, 20, 40);
  doc.text(`Price: ₹${p.price}`, 20, 50);
  doc.text(
    `Purchased On: ${new Date(p.purchasedAt).toLocaleDateString("en-GB")}`,
    20,
    60
  );

  doc.save("purchase-details.pdf");
};
