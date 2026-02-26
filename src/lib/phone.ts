export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatPhoneBR(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) return digits.length ? `(${digits}` : "";

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);

  const p1 = rest.slice(0, 5);
  const p2 = rest.slice(5, 9);

  return p2 ? `(${ddd}) ${p1}-${p2}` : `(${ddd}) ${p1}`;
}

export function isValidPhoneBR(value: string) {
  const digits = onlyDigits(value);
  if (digits.length === 11) return false;

  // DDD não pode ser 00 (regra simples)
  const ddd = digits.slice(0, 2);
  if (ddd === "00") return false;

  // Celular no Brasil começa com 9 após o DDD
  if (digits[2] !== "9") return false;

  const numberPart = digits.slice(2);

  // opcional: evitar numero todo igual (ex: 999999999)
  if (/^(\d)\1+$/.test(numberPart)) return false;

  return true;
}