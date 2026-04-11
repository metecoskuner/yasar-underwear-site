export const CONTACT = {
  PHONE_MAIN: '+902125209299',
  PHONE_MOBILE: '+905379811797',
  EMAIL: 'info@yasarunderwear.com'
};

// Build WhatsApp URL from env variable with fallback
const rawWhatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
const whatsappNumber = (rawWhatsappNumber.includes('$') ? '' : rawWhatsappNumber.trim()) || '+902125190149';
const whatsappDigits = whatsappNumber.replace(/[^0-9]/g, '');

export const SOCIAL = {
  INSTAGRAM: 'https://www.instagram.com/',
  FACEBOOK: 'https://www.facebook.com/',
  WHATSAPP: `https://wa.me/${whatsappDigits}`
};
