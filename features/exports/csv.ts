/** RFC4180-style CSV helpers for admin exports. */

export function toCsv(
  headers: string[],
  rows: Array<Array<string | number | null | undefined>>,
): string {
  const escape = (value: string | number | null | undefined) => {
    const text = value == null ? "" : String(value);
    if (/[",\n\r]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };

  return [headers.map(escape).join(","), ...rows.map((row) => row.map(escape).join(","))].join(
    "\r\n",
  );
}
