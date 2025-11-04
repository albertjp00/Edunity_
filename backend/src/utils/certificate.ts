import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

export const generateCertificate = async (
  userName: string,
  courseTitle: string,
  userId: string,
  courseId: string
): Promise<string> => {
  const certDir = path.join(process.cwd(), "src/assets");
  if (!fs.existsSync(certDir)) fs.mkdirSync(certDir, { recursive: true });

  const filePath = path.join(certDir, `${userId}-${courseId}.pdf`);

  const doc = new PDFDocument({ layout: "landscape", size: "A4", margin: 40 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // ===== Logo + Brand =====
  const logoPath = path.join(process.cwd(), "src/assets/logo.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 60, 40, { width: 90 });
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor("#0D47A1")
      .text("Edunity", 60, 135);
  }

  // ===== Title =====
  doc
    .fontSize(34)
    .fillColor("#0D47A1")
    .text("Certificate of Completion", 0, 170, { align: "center" });

  // ===== Badge below the title =====
  const badgePath = path.join(process.cwd(), "src/assets/badge.jpeg");
  if (fs.existsSync(badgePath)) {
    doc.image(badgePath, 360, 215, { width: 120 });
  }

  // ===== Certificate Body =====
  const startY = 370;
  doc
    .fontSize(18)
    .fillColor("#000")
    .text("This certificate is proudly presented to", 0, startY, {
      align: "center",
    });

  doc
    .font("Helvetica-Bold")
    .fontSize(26)
    .text(userName || "Learner", 0, startY + 40, { align: "center" });

  doc
    .font("Helvetica")
    .fontSize(18)
    .text(`for successfully completing the course "${courseTitle}"`, 0, startY + 80, {
      align: "center",
    });

  doc
    .fontSize(16)
    .text(`Date: ${new Date().toLocaleDateString()}`, 0, startY + 130, {
      align: "center",
    });

  // ===== Footer =====
  doc
    .fontSize(12)
    .fillColor("#777")
    .text("© Edunity - Empowering Learning Through Technology", 0, 520, {
      align: "center",
    });

  doc.end();

  return new Promise((resolve) => {
    stream.on("finish", () => resolve(filePath));
  });
};
