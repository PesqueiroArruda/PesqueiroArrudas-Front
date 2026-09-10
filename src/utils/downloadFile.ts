interface Props {
  data: string;
  fileName: string;
  fileType: string;
}

export const downloadFile = ({ data, fileName, fileType }: Props) => {
  // Create a blob with the data we want to download as a file
  const blob = new Blob([data], { type: fileType });
  // Create an anchor element and dispatch a click event on it
  // to trigger a download
  const a = document.createElement('a');
  a.download = fileName;
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  document.body.appendChild(a);
  try {
    a.click();
  } finally {
    a.remove();
    // Let the browser start the download before releasing the blob URL.
    window.setTimeout(() => window.URL.revokeObjectURL(url), 0);
  }
};
