/**
 * ! Patrón Facade:
 * Es un patrón de diseño estructural que proporciona una interfaz simplificada
 * a un conjunto de interfaces en un subsistema complejo.
 *
 * La Facade no encapsula el subsistema, solo ofrece un punto de entrada
 * simplificado. El cliente aún puede usar el subsistema directamente si lo necesita.
 *
 * * Es útil cuando quieres simplificar la interacción con un sistema complejo
 * * o reducir las dependencias entre el cliente y los subsistemas.
 *
 * https://refactoring.guru/es/design-patterns/facade
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Subsistemas complejos ────────────────────────────────────────────────────
// Cada clase tiene su propia responsabilidad y API detallada.

class VideoDecoder {
  decode(file: string): string {
    console.log(`%c  [VideoDecoder] Decodificando archivo: ${file}`, COLORS.gray);
    return `frames::${file}`;
  }
}

class AudioDecoder {
  decode(file: string): string {
    console.log(`%c  [AudioDecoder] Decodificando audio: ${file}`, COLORS.gray);
    return `audio::${file}`;
  }
}

class VideoEncoder {
  encode(frames: string, format: string): string {
    console.log(`%c  [VideoEncoder] Codificando a ${format}...`, COLORS.gray);
    return `${frames}::encoded(${format})`;
  }
}

class AudioMixer {
  mix(audio: string, frames: string): string {
    console.log(`%c  [AudioMixer] Mezclando audio con video...`, COLORS.gray);
    return `mixed(${audio}+${frames})`;
  }
}

class FileSaver {
  save(data: string, output: string): void {
    console.log(`%c  [FileSaver] Guardando resultado en: ${output}`, COLORS.gray);
    console.log(`%c  [FileSaver] Datos: ${data}`, COLORS.gray);
  }
}

// ─── Facade ───────────────────────────────────────────────────────────────────
// Coordina todos los subsistemas y expone un único método simple al cliente.
class VideoConverterFacade {
  private readonly videoDecoder = new VideoDecoder();
  private readonly audioDecoder = new AudioDecoder();
  private readonly videoEncoder = new VideoEncoder();
  private readonly audioMixer   = new AudioMixer();
  private readonly fileSaver    = new FileSaver();

  convert(inputFile: string, outputFormat: string): void {
    console.log(`%c\n[Facade] Iniciando conversión: ${inputFile} → ${outputFormat}`, COLORS.cyan);

    const frames    = this.videoDecoder.decode(inputFile);
    const audio     = this.audioDecoder.decode(inputFile);
    const encoded   = this.videoEncoder.encode(frames, outputFormat);
    const mixed     = this.audioMixer.mix(audio, encoded);
    const outputFile = inputFile.replace(/\.\w+$/, `.${outputFormat}`);

    this.fileSaver.save(mixed, outputFile);
    console.log(`%c[Facade] ¡Conversión completada! → ${outputFile}\n`, COLORS.green);
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
// El cliente solo llama a un método; no sabe nada de los 5 subsistemas.
function main() {
  console.log('%c=== Patrón Facade: Conversor de Video ===', COLORS.orange);

  const converter = new VideoConverterFacade();

  converter.convert('pelicula.avi', 'mp4');
  converter.convert('tutorial.mkv', 'webm');
}

main();
