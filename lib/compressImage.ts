// Must match the backend's multer upload size limit.
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const MAX_DIMENSION = 2400;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read this image file."));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

/**
 * Re-encodes a file as JPEG at shrinking quality/dimensions until it fits under
 * maxBytes. Animated GIFs are rejected instead of silently collapsed to one frame.
 */
export async function compressImageIfNeeded(file: File, maxBytes = MAX_UPLOAD_BYTES): Promise<File> {
  if (file.size <= maxBytes) return file;

  if (file.type === "image/gif") {
    throw new Error(
      `This GIF is ${(file.size / 1024 / 1024).toFixed(1)}MB — animated GIFs can't be auto-compressed without losing their animation. Please choose a file under 5MB.`
    );
  }

  const img = await loadImage(file);
  let width = img.naturalWidth;
  let height = img.naturalHeight;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  let quality = 0.9;
  let blob: Blob | null = null;
  for (let attempt = 0; attempt < 8; attempt++) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("This browser can't process images for compression.");
    ctx.drawImage(img, 0, 0, width, height);

    blob = await canvasToBlob(canvas, quality);
    if (blob && blob.size <= maxBytes) break;

    if (quality > 0.5) {
      quality -= 0.15;
    } else {
      width = Math.round(width * 0.85);
      height = Math.round(height * 0.85);
    }
  }

  if (!blob || blob.size > maxBytes) {
    throw new Error("This image is still too large after compression. Please choose a smaller file.");
  }

  const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg", lastModified: Date.now() });
}
