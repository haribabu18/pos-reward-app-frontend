/**
 * OTP Service for handling OTP generation, storage and verification
 */

// In-memory storage for OTPs (in a real app, this would be in a database)
const otpStorage = new Map();

// OTP expiration time in milliseconds (5 minutes)
const OTP_EXPIRY = 5 * 60 * 1000;

/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Store OTP for a phone number
 * @param {string} phoneNumber - The phone number to store OTP for
 * @param {string} otp - The OTP to store
 */
const storeOTP = (phoneNumber, otp) => {
  otpStorage.set(phoneNumber, {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY,
  });
};

/**
 * Verify OTP for a phone number
 * @param {string} phoneNumber - The phone number to verify OTP for
 * @param {string} otp - The OTP to verify
 * @returns {boolean} Whether the OTP is valid
 */
const verifyOTP = (phoneNumber, otp) => {
  const storedData = otpStorage.get(phoneNumber);
  
  if (!storedData) {
    return false;
  }
  
  if (Date.now() > storedData.expiresAt) {
    // OTP expired, remove it
    otpStorage.delete(phoneNumber);
    return false;
  }

  console.log(storedData.otp,otp);
  
  if (storedData.otp !== otp) {
    return false;
  }
  
  // OTP verified, remove it to prevent reuse
  otpStorage.delete(phoneNumber);
  return true;
};

export { generateOTP, storeOTP, verifyOTP };