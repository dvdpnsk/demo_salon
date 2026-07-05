export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ'-]+(\s[A-Za-zÀ-ÖØ-öø-ÿ'-]+)+$/;
export const PHONE_PATTERN = /^(\+49[\s\-]?|0)[1-9][0-9\s\-\/]{5,14}$/;

export function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidName(value: string) {
  return NAME_PATTERN.test(value.trim());
}

export function isValidPhone(value: string) {
  return PHONE_PATTERN.test(value.trim());
}
