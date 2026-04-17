import { COLORS } from '../helpers/colors.ts';

// ============================================================
// VISITOR — Patrón de Comportamiento
// ============================================================
// Permite añadir nuevas operaciones a una jerarquía de clases
// sin modificarlas. Separa el algoritmo del objeto sobre el
// que opera.
//
// Clave: double dispatch.
//   element.accept(visitor) → visitor.visitXxx(element)
//
// Participantes:
//   Visitor         → DocumentVisitor (interfaz)
//   ConcreteVisitors→ HtmlExporter, XmlExporter, StatisticsVisitor
//   Element         → DocumentNode (interfaz con accept())
//   ConcreteElements→ HeadingNode, ParagraphNode, ImageNode, LinkNode
// ============================================================

// --- Interfaces ---

interface DocumentVisitor {
  visitHeading(node: HeadingNode): void;
  visitParagraph(node: ParagraphNode): void;
  visitImage(node: ImageNode): void;
  visitLink(node: LinkNode): void;
}

interface DocumentNode {
  accept(visitor: DocumentVisitor): void;
}

// --- Elementos concretos ---

class HeadingNode implements DocumentNode {
  readonly text: string;
  readonly level: number; // 1-6

  constructor(text: string, level: number) {
    this.text  = text;
    this.level = level;
  }

  accept(visitor: DocumentVisitor): void {
    visitor.visitHeading(this);
  }
}

class ParagraphNode implements DocumentNode {
  readonly text: string;

  constructor(text: string) {
    this.text = text;
  }

  accept(visitor: DocumentVisitor): void {
    visitor.visitParagraph(this);
  }
}

class ImageNode implements DocumentNode {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;

  constructor(src: string, alt: string, width: number, height: number) {
    this.src    = src;
    this.alt    = alt;
    this.width  = width;
    this.height = height;
  }

  accept(visitor: DocumentVisitor): void {
    visitor.visitImage(this);
  }
}

class LinkNode implements DocumentNode {
  readonly href: string;
  readonly label: string;
  readonly isExternal: boolean;

  constructor(href: string, label: string, isExternal: boolean) {
    this.href       = href;
    this.label      = label;
    this.isExternal = isExternal;
  }

  accept(visitor: DocumentVisitor): void {
    visitor.visitLink(this);
  }
}

// --- Visitor 1: Exportar a HTML ---

class HtmlExporter implements DocumentVisitor {
  private lines: string[] = [];

  visitHeading(node: HeadingNode): void {
    this.lines.push(`<h${node.level}>${node.text}</h${node.level}>`);
  }

  visitParagraph(node: ParagraphNode): void {
    this.lines.push(`<p>${node.text}</p>`);
  }

  visitImage(node: ImageNode): void {
    this.lines.push(
      `<img src="${node.src}" alt="${node.alt}" width="${node.width}" height="${node.height}" />`
    );
  }

  visitLink(node: LinkNode): void {
    const target = node.isExternal ? ' target="_blank" rel="noopener"' : '';
    this.lines.push(`<a href="${node.href}"${target}>${node.label}</a>`);
  }

  getOutput(): string {
    return this.lines.join('\n');
  }
}

// --- Visitor 2: Exportar a XML ---

class XmlExporter implements DocumentVisitor {
  private lines: string[] = [];

  visitHeading(node: HeadingNode): void {
    this.lines.push(`<heading level="${node.level}">${node.text}</heading>`);
  }

  visitParagraph(node: ParagraphNode): void {
    this.lines.push(`<paragraph>${node.text}</paragraph>`);
  }

  visitImage(node: ImageNode): void {
    this.lines.push(
      `<image src="${node.src}" alt="${node.alt}" width="${node.width}" height="${node.height}" />`
    );
  }

  visitLink(node: LinkNode): void {
    this.lines.push(
      `<link href="${node.href}" external="${node.isExternal}">${node.label}</link>`
    );
  }

  getOutput(): string {
    return `<?xml version="1.0"?>\n<document>\n` +
      this.lines.map(l => `  ${l}`).join('\n') +
      `\n</document>`;
  }
}

// --- Visitor 3: Estadísticas ---

class StatisticsVisitor implements DocumentVisitor {
  private headings   = 0;
  private paragraphs = 0;
  private images     = 0;
  private links      = 0;
  private wordCount  = 0;
  private externalLinks = 0;

  visitHeading(node: HeadingNode): void {
    this.headings++;
    this.wordCount += node.text.split(' ').length;
  }

  visitParagraph(node: ParagraphNode): void {
    this.paragraphs++;
    this.wordCount += node.text.split(' ').length;
  }

  visitImage(_node: ImageNode): void {
    this.images++;
  }

  visitLink(node: LinkNode): void {
    this.links++;
    if (node.isExternal) this.externalLinks++;
  }

  printReport(): void {
    console.log(`  ${COLORS.yellow}Headings:${COLORS.reset}    ${this.headings}`);
    console.log(`  ${COLORS.yellow}Paragraphs:${COLORS.reset}  ${this.paragraphs}`);
    console.log(`  ${COLORS.yellow}Images:${COLORS.reset}      ${this.images}`);
    console.log(`  ${COLORS.yellow}Links:${COLORS.reset}       ${this.links} (${this.externalLinks} externos)`);
    console.log(`  ${COLORS.yellow}Palabras:${COLORS.reset}    ${this.wordCount}`);
  }
}

// ============================================================
// Demo
// ============================================================

const document: DocumentNode[] = [
  new HeadingNode('Guía de TypeScript', 1),
  new ParagraphNode('TypeScript es un superconjunto tipado de JavaScript que compila a JS plano.'),
  new HeadingNode('Instalación', 2),
  new ParagraphNode('Ejecuta npm install -g typescript para instalar el compilador.'),
  new ImageNode('setup.png', 'Diagrama de instalación', 800, 400),
  new HeadingNode('Primeros pasos', 2),
  new ParagraphNode('Crea un archivo con extensión .ts y compílalo con tsc.'),
  new LinkNode('https://typescriptlang.org', 'Documentación oficial', true),
  new LinkNode('/examples', 'Ver ejemplos', false),
];

// Exportar HTML
console.log(`\n${COLORS.cyan}=== Exportación HTML ===${COLORS.reset}`);
const html = new HtmlExporter();
for (const node of document) node.accept(html);
console.log(html.getOutput());

// Exportar XML
console.log(`\n${COLORS.cyan}=== Exportación XML ===${COLORS.reset}`);
const xml = new XmlExporter();
for (const node of document) node.accept(xml);
console.log(xml.getOutput());

// Estadísticas — mismo documento, nuevo visitor, sin tocar los nodos
console.log(`\n${COLORS.cyan}=== Estadísticas del documento ===${COLORS.reset}`);
const stats = new StatisticsVisitor();
for (const node of document) node.accept(stats);
stats.printReport();
