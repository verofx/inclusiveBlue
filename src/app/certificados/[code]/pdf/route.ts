import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { appUrl, type ValidatorSnapshot } from "@/lib/certificates";
import { db } from "@/lib/db";
import { AUDIENCE_LABEL, isAudience } from "@/lib/roles";

const BLUE = rgb(0.03, 0.23, 0.47);
const INK = rgb(0.08, 0.13, 0.24);
const dateFormat = new Intl.DateTimeFormat("es-AR", { dateStyle: "long", timeZone: "America/Argentina/Jujuy" });

export async function GET(_: Request, { params }: { params: Promise<{ code: string }> }) {
  const code = decodeURIComponent((await params).code).toUpperCase();
  const cert = await db.certificate.findUnique({ where: { code }, include: { user: { select: { name: true } } } });
  if (!cert) return new Response("Certificado no encontrado", { status: 404 });

  const verifyUrl = `${appUrl()}/verificar/${cert.code}`;
  const validators = JSON.parse(cert.validatorsJson) as ValidatorSnapshot[];
  const audience = isAudience(cert.audience) ? AUDIENCE_LABEL[cert.audience].toLowerCase() : cert.audience;

  const pdf = await PDFDocument.create();
  pdf.setTitle(`Certificado InclusiveBlue - ${cert.capsuleTitle}`);
  pdf.setAuthor("InclusiveBlue");
  pdf.setLanguage("es-AR");
  const page = pdf.addPage([842, 595]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width } = page.getSize();

  page.drawRectangle({ x: 24, y: 24, width: width - 48, height: 547, borderColor: BLUE, borderWidth: 4 });
  const center = (text: string, y: number, size: number, font = regular, color = INK) =>
    page.drawText(text, { x: (width - font.widthOfTextAtSize(text, size)) / 2, y, size, font, color });

  center("InclusiveBlue", 500, 20, bold, BLUE);
  center("Certificado de aprendizaje", 455, 32, bold);
  center("Se certifica que", 405, 16);
  center(cert.user.name, 365, 30, bold, BLUE);
  center(`completó la cápsula "${cert.capsuleTitle}"`, 325, 18);
  center(`Recorrido para ${audience} - ${dateFormat.format(cert.issuedAt)}`, 298, 14);
  if (validators.length > 0) {
    const line = validators
      .map((v) => [v.name, v.profession, v.license && `Mat. ${v.license}`].filter(Boolean).join(", "))
      .join(" / ");
    center(`Contenido validado por: ${line}`, 255, 12);
  }

  const qrPng = await QRCode.toBuffer(verifyUrl, { margin: 1, width: 300 });
  const qr = await pdf.embedPng(qrPng);
  page.drawImage(qr, { x: 60, y: 50, width: 120, height: 120 });
  page.drawText("Verificá este certificado:", { x: 195, y: 130, size: 12, font: bold, color: INK });
  page.drawText(verifyUrl, { x: 195, y: 110, size: 11, font: regular, color: BLUE });
  page.drawText(`Código: ${cert.code}`, { x: 195, y: 90, size: 11, font: regular, color: INK });
  page.drawText(`Versión del contenido: ${cert.contentHash.slice(0, 8)}`, { x: 195, y: 72, size: 10, font: regular, color: INK });

  const bytes = await pdf.save();
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="certificado-${cert.code}.pdf"`,
    },
  });
}
