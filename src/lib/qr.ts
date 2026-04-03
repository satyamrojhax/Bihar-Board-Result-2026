import QRCode from "qrcode";

/**
 * Generate a QR code data URL for the given text/URL.
 * Returns a base64 data:image/png string.
 */
export async function generateQRDataURL(
  text: string,
  size: number = 256
): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: size,
      margin: 1,
      color: {
        dark: "#1D1D1F",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });
  } catch {
    return "";
  }
}
