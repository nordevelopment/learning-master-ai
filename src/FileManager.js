const fs = require('fs').promises;
const path = require('path');

class FileManager {
  constructor(basePath = '.') {
    this.basePath = path.resolve(basePath);
  }

  /**
   * Private method to get full path
   */
  _getFullPath(filePath) {
    return path.join(this.basePath, filePath);
  }

  /**
   * Async/await - recommended modern approach
   */
  async writeFileAsync(filePath, content, encoding = 'utf8') {
    try {
      const fullPath = this._getFullPath(filePath);
      await fs.writeFile(fullPath, content, encoding);
      console.log(`[Async] File written: ${fullPath}`);
      return true;
    } catch (error) {
      console.error(`[Async] Error writing file:`, error);
      throw error;
    }
  }



  /**
   * Async/await - recommended for reading
   */
  async readFileAsync(filePath, encoding = 'utf8') {
    try {
      const fullPath = this._getFullPath(filePath);
      const content = await fs.readFile(fullPath, encoding);
      console.log(`[Async] File read: ${fullPath}`);
      return content;
    } catch (error) {
      console.error(`[Async] Error reading file:`, error);
      throw error;
    }
  }



  /**
   * Append to file (async)
   */
  async appendFileAsync(filePath, content, encoding = 'utf8') {
    try {
      const fullPath = this._getFullPath(filePath);
      await fs.appendFile(fullPath, content, encoding);
      console.log(`[Async] Content appended to: ${fullPath}`);
      return true;
    } catch (error) {
      console.error(`[Async] Error appending to file:`, error);
      throw error;
    }
  }

  /**
   * Check if file exists (async)
   */
  async fileExistsAsync(filePath) {
    try {
      const fullPath = this._getFullPath(filePath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Delete file (async)
   */
  async deleteFileAsync(filePath) {
    try {
      const fullPath = this._getFullPath(filePath);
      await fs.unlink(fullPath);
      console.log(`[Async] File deleted: ${fullPath}`);
      return true;
    } catch (error) {
      console.error(`[Async] Error deleting file:`, error);
      throw error;
    }
  }

  /**
   * AI-specific: Write JSON data (models, configs, prompts)
   */
  async writeJsonAsync(filePath, data, pretty = true) {
    try {
      const jsonString = pretty ? 
        JSON.stringify(data, null, 2) : 
        JSON.stringify(data);
      return await this.writeFileAsync(filePath, jsonString, 'utf8');
    } catch (error) {
      console.error(`[Async] Error writing JSON:`, error);
      throw error;
    }
  }

  /**
   * AI-specific: Read JSON data
   */
  async readJsonAsync(filePath) {
    try {
      const content = await this.readFileAsync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`[Async] Error reading JSON:`, error);
      throw error;
    }
  }

  /**
   * AI-specific: Write training data (CSV, JSONL)
   */
  async writeTrainingDataAsync(filePath, data, format = 'jsonl') {
    try {
      let content = '';
      
      if (format === 'jsonl') {
        // JSONL format for training
        content = data.map(item => JSON.stringify(item)).join('\n');
      } else if (format === 'csv') {
        // Simple CSV format
        if (data.length > 0) {
          const headers = Object.keys(data[0]);
          content = headers.join(',') + '\n';
          content += data.map(row => 
            headers.map(header => row[header] || '').join(',')
          ).join('\n');
        }
      }
      
      return await this.writeFileAsync(filePath, content, 'utf8');
    } catch (error) {
      console.error(`[Async] Error writing training data:`, error);
      throw error;
    }
  }

  /**
   * AI-specific: Read training data
   */
  async readTrainingDataAsync(filePath, format = 'jsonl') {
    try {
      const content = await this.readFileAsync(filePath, 'utf8');
      const lines = content.trim().split('\n').filter(line => line);
      
      if (format === 'jsonl') {
        return lines.map(line => JSON.parse(line));
      } else if (format === 'csv') {
        const headers = lines[0].split(',');
        return lines.slice(1).map(line => {
          const values = line.split(',');
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = values[index];
          });
          return obj;
        });
      }
    } catch (error) {
      console.error(`[Async] Error reading training data:`, error);
      throw error;
    }
  }

  /**
   * AI-specific: Create directory if not exists
   */
  async ensureDirectoryAsync(dirPath) {
    try {
      const fullPath = this._getFullPath(dirPath);
      await fs.mkdir(fullPath, { recursive: true });
      console.log(`[Async] Directory ensured: ${fullPath}`);
      return true;
    } catch (error) {
      console.error(`[Async] Error creating directory:`, error);
      throw error;
    }
  }

  /**
   * AI-specific: List directory contents (returns objects with name and isDir)
   */
  async listDirAsync(dirPath) {
    try {
      const fullPath = this._getFullPath(dirPath);
      const entries = await fs.readdir(fullPath, { withFileTypes: true });
      
      return entries.map(entry => ({
        name: entry.name,
        isDir: entry.isDirectory(),
        size: 0 // Optional: could get stats if needed
      }));
    } catch (error) {
      console.error(`[Async] Error listing directory:`, error);
      throw error;
    }
  }

  /**
   * AI-specific: List files in directory (for datasets)
   */
  async listFilesAsync(dirPath, extension = null) {
    try {
      const fullPath = this._getFullPath(dirPath);
      const files = await fs.readdir(fullPath);
      
      if (extension) {
        return files.filter(file => file.endsWith(extension));
      }
      
      return files;
    } catch (error) {
      console.error(`[Async] Error listing files:`, error);
      throw error;
    }
  }

  /**
   * AI-specific: Copy file (for dataset backups)
   */
  async copyFileAsync(sourcePath, destPath) {
    try {
      const fullSourcePath = this._getFullPath(sourcePath);
      const fullDestPath = this._getFullPath(destPath);
      
      await fs.copyFile(fullSourcePath, fullDestPath);
      console.log(`[Async] File copied: ${fullSourcePath} -> ${fullDestPath}`);
      return true;
    } catch (error) {
      console.error(`[Async] Error copying file:`, error);
      throw error;
    }
  }
}

module.exports = FileManager;
