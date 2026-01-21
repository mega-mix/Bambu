import fs from 'fs/promises';
import path from 'path';

export default class ConfigManager {
  /**
   * @param {string} filename - Name der Datei (z.B. 'settings.json')
   * @param {string} baseDir - (Optional) Basisverzeichnis. Standard: Root.
   */
  constructor(filename, baseDir = process.cwd()) {
    this.filePath = path.join(baseDir, filename);
  }

  async load() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Wenn Datei nicht existiert, leeres Objekt zurückgeben
      if (error.code === 'ENOENT') return {};
      throw error;
    }
  }

  async save(data) {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Daten müssen ein gültiges Objekt sein.');
    }
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(this.filePath, jsonString, 'utf-8');
    console.log(`Gespeichert: ${this.filePath}`);
  }
}