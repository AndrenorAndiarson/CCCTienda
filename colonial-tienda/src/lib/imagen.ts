/**
 * Prepara una imagen para subirla a Supabase Storage.
 * Devuelve WebP redimensionado cuando el navegador puede procesarlo.
 */
export async function compressImage(
  file: File,
  maxDimension = 1600,
  quality = 0.82,
): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Selecciona un archivo de imagen.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("No se pudo procesar la imagen en este navegador.");
  }

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => result ? resolve(result) : reject(new Error("No se pudo comprimir la imagen.")),
      "image/webp",
      quality,
    );
  });

  const baseName = file.name.replace(/\.[^.]+$/, "") || "producto";
  return new File([blob], `${baseName}.webp`, { type: "image/webp" });
}