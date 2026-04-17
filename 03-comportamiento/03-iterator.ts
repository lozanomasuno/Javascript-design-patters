/**
 * ! Patrón Iterator:
 * Es un patrón de diseño de comportamiento que permite recorrer elementos
 * de una colección sin exponer su representación interna
 * (lista, pila, árbol, grafo, etc.).
 *
 * * Es útil cuando quieres proporcionar una forma estándar de recorrer
 * * diferentes tipos de colecciones sin que el cliente dependa de su estructura.
 *
 * https://refactoring.guru/es/design-patterns/iterator
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Interfaz Iterator ────────────────────────────────────────────────────────
interface Iterator<T> {
  hasNext(): boolean;
  next(): T;
  reset(): void;
}

// ─── Interfaz de la colección iterable ───────────────────────────────────────
interface IterableCollection<T> {
  createIterator(): Iterator<T>;
  createReverseIterator(): Iterator<T>;
}

// ─── Colección concreta: Playlist ────────────────────────────────────────────
interface Song {
  title: string;
  artist: string;
  duration: number; // segundos
}

class Playlist implements IterableCollection<Song> {
  private readonly songs: Song[] = [];

  add(song: Song): this {
    this.songs.push(song);
    return this;
  }

  getSongs(): Song[] { return [...this.songs]; }

  createIterator(): Iterator<Song> {
    return new PlaylistIterator(this.songs);
  }

  createReverseIterator(): Iterator<Song> {
    return new ReversePlaylistIterator(this.songs);
  }
}

// ─── Iterador concreto: orden normal ─────────────────────────────────────────
class PlaylistIterator implements Iterator<Song> {
  private index = 0;

  constructor(private readonly songs: Song[]) {}

  hasNext(): boolean { return this.index < this.songs.length; }

  next(): Song {
    return this.songs[this.index++];
  }

  reset(): void { this.index = 0; }
}

// ─── Iterador concreto: orden inverso ────────────────────────────────────────
class ReversePlaylistIterator implements Iterator<Song> {
  private index: number;

  constructor(private readonly songs: Song[]) {
    this.index = songs.length - 1;
  }

  hasNext(): boolean { return this.index >= 0; }

  next(): Song {
    return this.songs[this.index--];
  }

  reset(): void { this.index = this.songs.length - 1; }
}

// ─── Función cliente ──────────────────────────────────────────────────────────
function playSongs(iterator: Iterator<Song>, label: string): void {
  console.log(`%c\n-- ${label} --`, COLORS.gray);
  while (iterator.hasNext()) {
    const song = iterator.next();
    const mins = Math.floor(song.duration / 60);
    const secs = String(song.duration % 60).padStart(2, '0');
    console.log(`%c  🎵 "${song.title}" — ${song.artist} (${mins}:${secs})`, COLORS.green);
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Patrón Iterator: Playlist de Música ===', COLORS.cyan);

  const playlist = new Playlist();
  playlist
    .add({ title: 'Bohemian Rhapsody', artist: 'Queen',         duration: 354 })
    .add({ title: 'Hotel California',  artist: 'Eagles',        duration: 391 })
    .add({ title: 'Stairway to Heaven',artist: 'Led Zeppelin',  duration: 482 })
    .add({ title: 'Smells Like Teen Spirit', artist: 'Nirvana', duration: 301 })
    .add({ title: 'Imagine',           artist: 'John Lennon',   duration: 187 });

  playSongs(playlist.createIterator(),        'Reproducción Normal');
  playSongs(playlist.createReverseIterator(), 'Reproducción Inversa');
}

main();
