export const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

export function validatePhoneNumber(number: string): string {
  if (!number) {
    return "Phone number is required";
  }
  if (!PHONE_REGEX.test(number)) {
    return "Please enter a valid phone number";
  }
  return "";
} 