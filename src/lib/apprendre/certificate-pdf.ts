import { readFile } from "fs/promises";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function buildCertificatePdf(opts: {
  learnerName: string;
  pathLabel: string;
  code: string;
  issuedAt: Date;
}): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]); // A4 landscape
  const { width, height } = page.getSize();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // Background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.965, 0.945, 0.91),
  });
  // Border
  page.drawRectangle({
    x: 28,
    y: 28,
    width: width - 56,
    height: height - 56,
    borderColor: rgb(0.757, 0.384, 0.176),
    borderWidth: 2.5,
  });
  page.drawRectangle({
    x: 36,
    y: 36,
    width: width - 72,
    height: height - 72,
    borderColor: rgb(0.12, 0.18, 0.28),
    borderWidth: 1,
  });

  try {
    const logoPath = path.join(process.cwd(), "public", "logo-mark.png");
    const logoBytes = await readFile(logoPath);
    const logo = await pdf.embedPng(logoBytes);
    const logoW = 64;
    const logoH = (logo.height / logo.width) * logoW;
    page.drawImage(logo, {
      x: width / 2 - logoW / 2,
      y: height - 120,
      width: logoW,
      height: logoH,
    });
  } catch {
    /* logo optional */
  }

  const brand = "ilémi.IA";
  const brandSize = 14;
  page.drawText(brand, {
    x: width / 2 - fontBold.widthOfTextAtSize(brand, brandSize) / 2,
    y: height - 140,
    size: brandSize,
    font: fontBold,
    color: rgb(0.12, 0.18, 0.28),
  });

  const title = "Certificat de réussite";
  const titleSize = 28;
  page.drawText(title, {
    x: width / 2 - fontBold.widthOfTextAtSize(title, titleSize) / 2,
    y: height - 200,
    size: titleSize,
    font: fontBold,
    color: rgb(0.757, 0.384, 0.176),
  });

  const subtitle = "Atteste que";
  page.drawText(subtitle, {
    x: width / 2 - font.widthOfTextAtSize(subtitle, 12) / 2,
    y: height - 240,
    size: 12,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  const name = opts.learnerName.slice(0, 80);
  const nameSize = 22;
  page.drawText(name, {
    x: width / 2 - fontBold.widthOfTextAtSize(name, nameSize) / 2,
    y: height - 280,
    size: nameSize,
    font: fontBold,
    color: rgb(0.12, 0.18, 0.28),
  });

  const line1 = `a complété avec succès le parcours « ${opts.pathLabel} »`;
  page.drawText(line1, {
    x: width / 2 - font.widthOfTextAtSize(line1, 13) / 2,
    y: height - 320,
    size: 13,
    font,
    color: rgb(0.25, 0.25, 0.25),
  });

  const dateStr = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Porto-Novo",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(opts.issuedAt);

  const line2 = `Délivré le ${dateStr} · Code ${opts.code}`;
  page.drawText(line2, {
    x: width / 2 - font.widthOfTextAtSize(line2, 11) / 2,
    y: height - 360,
    size: 11,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  const footer = "L'IA, enfin chez vous. · Formation Ilémi";
  page.drawText(footer, {
    x: width / 2 - font.widthOfTextAtSize(footer, 10) / 2,
    y: 56,
    size: 10,
    font,
    color: rgb(0.45, 0.45, 0.45),
  });

  return pdf.save();
}
