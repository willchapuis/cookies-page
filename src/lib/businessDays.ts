export function addBusinessDays(from: Date, businessDays: number) {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);

  let added = 0;
  while (added < businessDays) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay(); // 0=Dom, 6=Sáb
    const isWeekend = day === 0 || day === 6;
    if (!isWeekend) added += 1;
  }
  return d;
}

export function formatDateInput(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function formatDateBR(date: Date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function formatDateBRFromInput(value: string) {
  // Converte yyyy-mm-dd para dd-mm-yyyy
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const [y, m, d] = value.split("-");
  return `${d}-${m}-${y}`;
}