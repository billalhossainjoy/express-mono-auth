export function convertDollarsToCents(amount: number | string): number {
  // If the input is a string, remove the dollar sign and parse the number
  if (typeof amount === "string") {
    // Remove any dollar sign and spaces, then parse to float
    amount = amount.replace("$", "").trim();
  }

  // Convert the string to a float, multiply by 100 to convert dollars to cents, and round
  const cents = parseFloat(amount as string) * 100;

  // Return the result rounded to the nearest integer (cents should be an integer)
  return Math.round(cents);
}
