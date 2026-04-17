/**
 * ! Patrón Iterator:
 * Es un patrón de diseño de comportamiento que permite recorrer elementos
 * de una colección sin exponer su representación interna.
 *
 * https://refactoring.guru/es/design-patterns/iterator
 */

/**
 * ! Tarea: Iterador de árbol binario de búsqueda (BST)
 *
 * Implementa un árbol binario de búsqueda (BST) con dos iteradores:
 *
 *  1. InOrderIterator   → recorre el árbol en orden ascendente (izq → raíz → der).
 *  2. PreOrderIterator  → recorre el árbol en pre-orden (raíz → izq → der).
 *
 * El cliente no debe conocer la estructura interna del árbol.
 *
 * Árbol de ejemplo:
 *          8
 *        /   \
 *       3     10
 *      / \      \
 *     1   6     14
 *        / \   /
 *       4   7 13
 *
 * InOrder  esperado:  1, 3, 4, 6, 7, 8, 10, 13, 14
 * PreOrder esperado:  8, 3, 1, 6, 4, 7, 10, 14, 13
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Nodo del árbol ───────────────────────────────────────────────────────────
class TreeNode {
  left: TreeNode | null  = null;
  right: TreeNode | null = null;

  constructor(readonly value: number) {}
}

// ─── Árbol Binario de Búsqueda ────────────────────────────────────────────────
class BinarySearchTree {
  private root: TreeNode | null = null;

  insert(value: number): this {
    this.root = this.insertNode(this.root, value);
    return this;
  }

  private insertNode(node: TreeNode | null, value: number): TreeNode {
    if (!node) return new TreeNode(value);
    if (value < node.value) node.left  = this.insertNode(node.left,  value);
    else                    node.right = this.insertNode(node.right, value);
    return node;
  }

  createInOrderIterator(): Iterator<number> {
    return new InOrderIterator(this.root);
  }

  createPreOrderIterator(): Iterator<number> {
    return new PreOrderIterator(this.root);
  }
}

// ─── Interfaz Iterator ────────────────────────────────────────────────────────
interface Iterator<T> {
  hasNext(): boolean;
  next(): T;
  reset(): void;
}

// ─── InOrder Iterator (izq → raíz → der) ─────────────────────────────────────
class InOrderIterator implements Iterator<number> {
  private readonly items: number[] = [];
  private index = 0;

  constructor(root: TreeNode | null) {
    this.traverse(root);
  }

  private traverse(node: TreeNode | null): void {
    if (!node) return;
    this.traverse(node.left);
    this.items.push(node.value);
    this.traverse(node.right);
  }

  hasNext(): boolean { return this.index < this.items.length; }
  next(): number     { return this.items[this.index++]; }
  reset(): void      { this.index = 0; }
}

// ─── PreOrder Iterator (raíz → izq → der) ────────────────────────────────────
class PreOrderIterator implements Iterator<number> {
  private readonly items: number[] = [];
  private index = 0;

  constructor(root: TreeNode | null) {
    this.traverse(root);
  }

  private traverse(node: TreeNode | null): void {
    if (!node) return;
    this.items.push(node.value);
    this.traverse(node.left);
    this.traverse(node.right);
  }

  hasNext(): boolean { return this.index < this.items.length; }
  next(): number     { return this.items[this.index++]; }
  reset(): void      { this.index = 0; }
}

// ─── Función cliente ──────────────────────────────────────────────────────────
function printIterator(iterator: Iterator<number>, label: string): void {
  const values: number[] = [];
  while (iterator.hasNext()) values.push(iterator.next());
  console.log(`%c${label}:`, COLORS.yellow);
  console.log(`%c  ${values.join(', ')}`, COLORS.green);
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Iterator: Árbol Binario de Búsqueda ===\n', COLORS.cyan);

  const bst = new BinarySearchTree();
  bst.insert(8).insert(3).insert(10).insert(1).insert(6)
     .insert(14).insert(4).insert(7).insert(13);

  printIterator(bst.createInOrderIterator(),  'InOrder  (ascendente)');
  printIterator(bst.createPreOrderIterator(), 'PreOrder (raíz primero)');
}

main();
