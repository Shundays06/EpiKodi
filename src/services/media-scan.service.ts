import fs from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { tmdbService } from '@/services/tmdb.service';
import { cleanTitle, extractYear } from '@/lib/utils';
import { MediaType, MediaCategory } from '@prisma/client';

const VIDEO_EXTENSIONS = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm', '.m4v'];
const AUDIO_EXTENSIONS = ['.mp3', '.flac', '.wav', '.aac', '.ogg', '.m4a', '.wma'];
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];

interface ScanResult {
  scanned: number;
  added: number;
  updated: number;
  errors: string[];
}

export class MediaScanService {
  private getMediaPath(): string {
    return process.env.MEDIA_PATH || '/Users/illanmastey/epitech/SimulatedProject/EpiKodi/media';
  }

  async scanDirectory(dirPath?: string): Promise<ScanResult> {
    const scanPath = dirPath || this.getMediaPath();
    const result: ScanResult = {
      scanned: 0,
      added: 0,
      updated: 0,
      errors: [],
    };

    try {
      const files = await this.getFilesRecursively(scanPath);
      
      for (const filePath of files) {
        try {
          result.scanned++;
          const processed = await this.processFile(filePath);
          if (processed === 'added') result.added++;
          if (processed === 'updated') result.updated++;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          result.errors.push(`${filePath}: ${errorMsg}`);
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(`Scan directory error: ${errorMsg}`);
    }

    return result;
  }

  private async getFilesRecursively(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          const subFiles = await this.getFilesRecursively(fullPath);
          files.push(...subFiles);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (this.isSupportedFile(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dir}:`, error);
    }

    return files;
  }

  private isSupportedFile(ext: string): boolean {
    return (
      VIDEO_EXTENSIONS.includes(ext) ||
      AUDIO_EXTENSIONS.includes(ext) ||
      IMAGE_EXTENSIONS.includes(ext)
    );
  }

  private getMediaType(ext: string): MediaType {
    if (VIDEO_EXTENSIONS.includes(ext)) return 'VIDEO';
    if (AUDIO_EXTENSIONS.includes(ext)) return 'AUDIO';
    if (IMAGE_EXTENSIONS.includes(ext)) return 'IMAGE';
    return 'VIDEO'; // default
  }

  private async processFile(filePath: string): Promise<'added' | 'updated' | 'skipped'> {
    const stats = await fs.stat(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);
    const mediaType = this.getMediaType(ext);

    // Vérifier si le fichier existe déjà
    const existingMedia = await prisma.media.findUnique({
      where: { filePath },
      include: { metadata: true },
    });

    // Skip seulement si le média existe ET a déjà des métadonnées valides (pas null)
    if (existingMedia?.metadata?.tmdbId) {
      // Fichier déjà indexé avec métadonnées valides
      return 'skipped';
    }

    const title = cleanTitle(fileName);
    const year = extractYear(fileName);

    // Déterminer la catégorie
    let category: MediaCategory = 'OTHER';
    if (mediaType === 'VIDEO') {
      category = this.detectVideoCategory(fileName);
    } else if (mediaType === 'AUDIO') {
      category = 'MUSIC';
    }

    // Créer ou mettre à jour le média
    const media = await prisma.media.upsert({
      where: { filePath },
      update: {
        fileSize: BigInt(stats.size),
        updatedAt: new Date(),
      },
      create: {
        title,
        filePath,
        fileName,
        fileSize: BigInt(stats.size),
        mimeType: this.getMimeType(ext),
        type: mediaType,
        category,
        year,
      },
    });

    // Enrichir avec les métadonnées si c'est une vidéo
    if (mediaType === 'VIDEO' && (category === 'MOVIE' || category === 'TV_SHOW')) {
      try {
        await this.enrichMetadata(media.id, title, year, category === 'TV_SHOW');
      } catch (error) {
        console.error(`Error enriching ${title}:`, error);
      }
    }

    return existingMedia ? 'updated' : 'added';
  }

  private detectVideoCategory(fileName: string): MediaCategory {
    const lower = fileName.toLowerCase();
    
    // Détection série TV
    if (/s\d{2}e\d{2}/i.test(lower) || /\d{1,2}x\d{2}/i.test(lower)) {
      return 'TV_SHOW';
    }
    
    // Par défaut, considérer comme un film
    return 'MOVIE';
  }

  private getMimeType(ext: string): string {
    const mimeTypes: Record<string, string> = {
      '.mp4': 'video/mp4',
      '.mkv': 'video/x-matroska',
      '.avi': 'video/x-msvideo',
      '.mov': 'video/quicktime',
      '.wmv': 'video/x-ms-wmv',
      '.flv': 'video/x-flv',
      '.webm': 'video/webm',
      '.mp3': 'audio/mpeg',
      '.flac': 'audio/flac',
      '.wav': 'audio/wav',
      '.aac': 'audio/aac',
      '.ogg': 'audio/ogg',
      '.m4a': 'audio/mp4',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }

  private async enrichMetadata(
    mediaId: string,
    title: string,
    year?: number | null,
    isTV: boolean = false
  ): Promise<void> {
    try {
      console.log(`[TMDB] Enriching metadata for: ${title} (${year})`);
      const metadata = await tmdbService.enrichMediaMetadata(title, year || undefined, isTV);
      
      if (metadata) {
        console.log(`[TMDB] Metadata found for: ${title}, tmdbId: ${metadata.tmdbId}`);
        await prisma.metadata.upsert({
          where: { mediaId },
          update: metadata,
          create: {
            mediaId,
            ...metadata,
          },
        });
        console.log(`[TMDB] Metadata saved for: ${title}`);
      } else {
        console.log(`[TMDB] No metadata found for: ${title}`);
      }
    } catch (error) {
      console.error(`[TMDB] Failed to enrich metadata for ${title}:`, error);
    }
  }

  async deleteOrphanedMedia(): Promise<number> {
    const allMedia = await prisma.media.findMany();
    let deletedCount = 0;

    for (const media of allMedia) {
      try {
        await fs.access(media.filePath);
      } catch {
        // File doesn't exist anymore
        await prisma.media.delete({ where: { id: media.id } });
        deletedCount++;
      }
    }

    return deletedCount;
  }
}

export const mediaScanService = new MediaScanService();
