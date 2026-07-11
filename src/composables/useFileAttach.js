const { ipcRenderer } = window.require("electron");

const MAX_FILE_SIZE = 100 * 1024; // 100KB per file
const MAX_TOTAL_SIZE = 500 * 1024; // 500KB total

async function selectFiles() {
  const filePaths = await ipcRenderer.invoke("select-file");
  if (!filePaths) return [];
  const files = [];
  for (const filePath of filePaths) {
    const result = await ipcRenderer.invoke("read-file", filePath);
    if (result.success) {
      const fileName = filePath.split(/[\\/]/).pop();
      files.push({
        name: fileName,
        path: filePath,
        content: result.content,
        size: result.content.length,
      });
    }
  }
  return files;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function buildContextString(files) {
  if (!files || files.length === 0) return "";
  let context = "\n\n--- Attached Files ---\n";
  for (const file of files) {
    const truncated =
      file.content.length > MAX_FILE_SIZE
        ? file.content.substring(0, MAX_FILE_SIZE) +
          "\n... (truncated, file too large)"
        : file.content;
    context += `\n[File: ${file.name}]\n${truncated}\n`;
  }
  context += "--- End Attached Files ---\n";
  return context;
}

function getTotalSize(files) {
  return files.reduce((sum, f) => sum + f.size, 0);
}

function canAddMore(files) {
  return getTotalSize(files) < MAX_TOTAL_SIZE;
}

export function useFileAttach() {
  return {
    selectFiles,
    formatFileSize,
    buildContextString,
    getTotalSize,
    canAddMore,
    MAX_FILE_SIZE,
    MAX_TOTAL_SIZE,
  };
}
