// Images imported through the panel. The browser re-encodes every crop through a
// canvas, but the server never trusts that: it checks the real bytes before
// anything is written into the user's project.
import crypto from 'node:crypto';
import { EditError } from './html.js';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_IMAGE_SIDE = 8000; // stops "decompression bombs": tiny files that decode huge

// Identify the format from the file's first bytes (never from its name or MIME type).
export function sniff(buf) {
  const at = (i, ...bytes) => bytes.every((b, k) => buf[i + k] === b);
  const ascii = (i, s) => buf.toString('latin1', i, i + s.length) === s;
  if (buf.length >= 8 && at(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return { ext: 'png', mime: 'image/png' };
  if (buf.length >= 3 && at(0, 0xff, 0xd8, 0xff)) return { ext: 'jpg', mime: 'image/jpeg' };
  if (buf.length >= 6 && (ascii(0, 'GIF87a') || ascii(0, 'GIF89a'))) return { ext: 'gif', mime: 'image/gif' };
  if (buf.length >= 12 && ascii(0, 'RIFF') && ascii(8, 'WEBP')) return { ext: 'webp', mime: 'image/webp' };
  if (buf.length >= 12 && ascii(4, 'ftyp') && /^avi[fs]$/.test(buf.toString('latin1', 8, 12))) return { ext: 'avif', mime: 'image/avif' };
  return null;
}

// Width and height read from the file header, without decoding the image.
export function dimensions(buf, ext) {
  try {
    if (ext === 'png') return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
    if (ext === 'gif') return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
    if (ext === 'jpg') {
      for (let i = 2; i + 9 < buf.length;) {
        if (buf[i] !== 0xff) { i++; continue; }
        const m = buf[i + 1];
        if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
        const len = buf.readUInt16BE(i + 2);
        if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
        i += 2 + len;
      }
      return null;
    }
    if (ext === 'webp') {
      const chunk = buf.toString('latin1', 12, 16);
      if (chunk === 'VP8X') return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) };
      if (chunk === 'VP8L') { const b = buf.readUInt32LE(21); return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 }; }
      if (chunk === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
      return null;
    }
    if (ext === 'avif') {
      const i = buf.indexOf('ispe', 0, 'latin1');
      return i > 0 ? { w: buf.readUInt32BE(i + 8), h: buf.readUInt32BE(i + 12) } : null;
    }
  } catch { /* truncated header */ }
  return null;
}

// Markup or code hidden inside an "image" (a polyglot file) is refused outright.
const HIDDEN_CODE = /<\s*(script|svg|html|iframe|object|embed)\b|<\?php|javascript:/i;

// Decode a base64 upload and check it. Returns { buf, ext, mime, w, h } or throws.
export function checkImage(base64) {
  if (typeof base64 !== 'string' || !base64) throw new EditError('No image was sent.', 400);
  if (base64.length > Math.ceil(MAX_IMAGE_BYTES / 3) * 4 + 4) throw new EditError('This image is larger than 5 MB. Choose a smaller one or crop it more.', 413);
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) throw new EditError('The image data is damaged.', 400);
  const buf = Buffer.from(base64, 'base64');
  if (buf.length === 0) throw new EditError('The image is empty.', 400);
  if (buf.length > MAX_IMAGE_BYTES) throw new EditError('This image is larger than 5 MB. Choose a smaller one or crop it more.', 413);
  const type = sniff(buf);
  if (!type) throw new EditError('This file is not a PNG, JPEG, WebP, GIF or AVIF image, so it was refused. (SVG files are refused because they can contain code.)', 415);
  if (HIDDEN_CODE.test(buf.toString('latin1'))) throw new EditError('This image contains hidden code or markup, so it was refused.', 415);
  const dim = dimensions(buf, type.ext);
  if (!dim || !dim.w || !dim.h) throw new EditError('Couldn\'t read this image\'s size, so it was refused.', 415);
  if (dim.w > MAX_IMAGE_SIDE || dim.h > MAX_IMAGE_SIDE) throw new EditError(`This image is ${dim.w}×${dim.h} pixels; the limit is ${MAX_IMAGE_SIDE}×${MAX_IMAGE_SIDE}.`, 413);
  return { buf, ...type, ...dim };
}

// A safe, unique file name: a short slug from the original name plus a content hash.
// The user never chooses the path, so nothing can be overwritten or escape the folder.
export function assetName(original, buf, ext) {
  const base = String(original || 'image').replace(/\.[^.]*$/, '').toLowerCase().normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'image';
  const hash = crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8);
  return `${base}-${hash}.${ext}`;
}
