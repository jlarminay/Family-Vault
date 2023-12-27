export default function (fileSize: number): string {
  const units = ['Bytes', 'KB', 'MB', 'GB'];
  let unitIndex = 0;

  while (fileSize >= 1024) {
    fileSize /= 1024;
    unitIndex++;
  }

  return `${fileSize.toFixed(2)} ${units[unitIndex]}`;
}
