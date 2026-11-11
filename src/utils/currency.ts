const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

export function formatINR(value: number): string {
  return INR_FORMATTER.format(value);
}
