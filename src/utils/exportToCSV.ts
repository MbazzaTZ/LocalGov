export function exportToCSV(data: any[], filename: string) {
  const csvRows: string[] = [];

  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  for (const row of data) {
    const values = headers.map((header) => `"${row[header] ?? ""}"`);
    csvRows.push(values.join(","));
  }

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  a.click();
}
