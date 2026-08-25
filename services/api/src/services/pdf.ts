import PDFDocument from 'pdfkit';
import { PitchDeck, PitchSlide } from '@fundable-ai/core-types';

export function generatePitchDeckPdfBuffer(deck: PitchDeck): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4', autoFirstPage: true });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err: Error) => reject(err));

      // Title Cover Section
      doc.fillColor('#1A202C').fontSize(24).text('FUNDABLE AI — INVESTOR PITCH DECK', { align: 'center' });
      doc.moveDown(0.5);
      doc.fillColor('#4A5568').fontSize(14).text(`Startup ID: ${deck.startupId} | Deck Version: v${deck.version}`, { align: 'center' });
      doc.moveDown(0.5);
      doc.fillColor('#718096').fontSize(10).text(`Generated at: ${new Date(deck.createdAt).toLocaleString()} | Verification: Strict 10-Slide Schema Contract`, { align: 'center' });
      doc.moveDown(2);

      deck.slides.forEach((slide: PitchSlide, idx: number) => {
        if (idx > 0) {
          doc.addPage();
        }

        // Header banner
        doc.fillColor('#2B6CB0').fontSize(10).text(`FUNDABLE AI INTELLIGENCE PLATFORM — SLIDE ${slide.slideNumber} OF 10`, { align: 'right' });
        doc.moveDown(0.5);

        // Slide Title & Category
        doc.fillColor('#1A202C').fontSize(18).text(`${slide.slideNumber}. ${slide.title}`);
        doc.fillColor('#319795').fontSize(10).text(`Category: ${slide.category}  |  Confidence Score: ${Math.round(slide.confidence * 100)}%`);
        doc.moveDown(1);

        // Headline
        doc.fillColor('#2D3748').fontSize(13).text(`Headline: ${slide.headline}`, { underline: true });
        doc.moveDown(0.5);

        // Purpose
        doc.fillColor('#4A5568').fontSize(10).text(`Purpose: ${slide.purpose}`);
        doc.moveDown(1);

        // Bullet Points
        doc.fillColor('#1A202C').fontSize(11).text('Key Investor Messages:', { underline: true });
        slide.bulletPoints.forEach((bullet: string) => {
          doc.fillColor('#2D3748').fontSize(10).text(`•  ${bullet}`, { indent: 15 });
        });
        doc.moveDown(1);

        // Evidence Grounding
        if (slide.evidenceReferences && slide.evidenceReferences.length > 0) {
          doc.fillColor('#2B6CB0').fontSize(10).text(`Verified Evidence References:`, { underline: true });
          slide.evidenceReferences.forEach((ref: string) => {
            doc.fillColor('#4A5568').fontSize(9).text(`   [Evidence Source] ${ref}`, { indent: 15 });
          });
          doc.moveDown(1);
        }

        // Speaker Notes
        doc.font('Helvetica-Oblique').fillColor('#718096').fontSize(9).text('Speaker Notes:');
        doc.font('Helvetica-Oblique').fillColor('#718096').fontSize(9).text(`"${slide.speakerNotes}"`, { indent: 10 });
        doc.font('Helvetica');
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
