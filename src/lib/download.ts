import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { apiClient } from "./api-client";

export async function downloadAndOpenPdf(
  url: string,
  filename: string,
): Promise<void> {
  // url is a full path like /recus/{id}/download — apiClient prefixes the base URL
  const relativePath = url.replace(apiClient.defaults.baseURL ?? "", "");

  const response = await apiClient.get(relativePath, {
    responseType: "arraybuffer",
  });

  const base64 = arrayBufferToBase64(response.data);
  const file = new File(Paths.cache, filename);
  file.create({ overwrite: true });
  file.write(base64, { encoding: "base64" });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(file.uri, { mimeType: "application/pdf" });
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return global.btoa(binary);
}
