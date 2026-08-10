export function formatName(
  first: string,
  last: string,
  title?: string
): string {
  const base = `${first} ${last}`.trim();
  return title ? `${title} ${base}` : base;
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

function padId(id: string, length: number = 4): string {
  const digits = id.replace(/\D/g, '');
  if (digits.length > 0) {
    return digits.slice(-length).padStart(length, '0');
  }
  const hash = id
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return String(hash % Math.pow(10, length)).padStart(length, '0');
}

export function formatPatientId(id: string): string {
  return `PAT-${padId(id, 4)}`;
}

export function formatCaseId(id: string): string {
  return `CASE-${padId(id, 4)}`;
}

export function generateQrPayload(patientId: string): string {
  const encodedId = encodeURIComponent(patientId);
  return `https://hospital.example.com/patients/${encodedId}`;
}
