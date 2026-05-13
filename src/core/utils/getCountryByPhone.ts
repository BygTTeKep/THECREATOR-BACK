import parsePhoneNumberFromString from 'libphonenumber-js';

export const getCountryByPhone = (phone: string): string | null => {
  const parsedPhone = parsePhoneNumberFromString(phone);
  if (!parsedPhone) {
    throw new Error('Invalid phone number');
  }
  return parsedPhone.country ?? null;
};
