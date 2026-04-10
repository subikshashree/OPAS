import { jsPDF } from 'jspdf';
import { LeaveRequest } from '../types';

export const generatePdfPass = async (leave: LeaveRequest, qrDataUrl: string) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Background Theme
  doc.setFillColor(240, 245, 255); // light blue tint
  doc.rect(0, 0, 210, 297, 'F');
  
  // Header Box
  doc.setFillColor(99, 102, 241); // indigo-500
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("OPAS E-PASS", 105, 25, { align: "center" });

  doc.setTextColor(50, 50, 50);
  
  // E-Pass Details Frame
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(20, 50, 170, 180, 5, 5, 'FD');

  doc.setFontSize(14);
  doc.text("Approved Outpass Authorization", 105, 65, { align: "center" });
  
  doc.setLineWidth(0.5);
  doc.line(30, 70, 180, 70);

  // Leave info
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  
  const startY = 85;
  const lineSpacing = 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Student Name:", 35, startY);
  doc.setFont("helvetica", "normal");
  doc.text(leave.studentName, 75, startY);

  doc.setFont("helvetica", "bold");
  doc.text("Student ID:", 35, startY + lineSpacing);
  doc.setFont("helvetica", "normal");
  doc.text(leave.studentId.toString(), 75, startY + lineSpacing);

  doc.setFont("helvetica", "bold");
  doc.text("Leave Type:", 35, startY + lineSpacing * 2);
  doc.setFont("helvetica", "normal");
  doc.text(leave.type, 75, startY + lineSpacing * 2);

  doc.setFont("helvetica", "bold");
  doc.text("Duration:", 35, startY + lineSpacing * 3);
  doc.setFont("helvetica", "normal");
  doc.text(`${leave.startDate} to ${leave.endDate}`, 75, startY + lineSpacing * 3);

  doc.setFont("helvetica", "bold");
  doc.text("Reason:", 35, startY + lineSpacing * 4);
  doc.setFont("helvetica", "normal");
  const splitReason = doc.splitTextToSize(leave.reason, 100);
  doc.text(splitReason, 75, startY + lineSpacing * 4);

  // QR Code
  if (qrDataUrl) {
    doc.addImage(qrDataUrl, 'PNG', 130, 140, 40, 40);
  }

  // Footer / Status
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129); // emerald green
  doc.text("STATUS: APPROVED", 105, 200, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated securely by OPAS on: ${new Date().toLocaleString()}`, 105, 215, { align: "center" });

  // Save the PDF
  doc.save(`OPAS_EPASS_${leave.studentId}.pdf`);
};
