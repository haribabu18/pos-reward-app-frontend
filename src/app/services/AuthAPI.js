/**
 * Mock API implementation for authentication endpoints
 */
import axios from 'axios';
import { generateOTP, storeOTP, verifyOTP } from './OTPService';

// Base URL for API requests
const API_BASE_URL = 'http://localhost:8081';

// Axios instance with credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Send OTP for signup verification
 * @param {string} phoneNumber - The phone number to send OTP to
 * @returns {Promise} - Promise resolving to API response
 */
export const sendSignupOTP = async (phoneNumber) => {
  try {
    // In a real implementation, this would call an SMS service
    // For now, we'll just generate and store the OTP locally
    const otp = generateOTP();
    storeOTP(phoneNumber, otp);
    
    console.log(`OTP for signup: ${otp} sent to ${phoneNumber}`);
    
    // Mock API response
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Error sending signup OTP:', error);
    throw error;
  }
};

/**
 * Verify OTP for signup
 * @param {string} phoneNumber - The phone number to verify OTP for
 * @param {string} otp - The OTP to verify
 * @returns {Promise} - Promise resolving to API response
 */
export const verifySignupOTP = async (phoneNumber, otp) => {
  try {
    const isValid = verifyOTP(phoneNumber, otp);
    
    return { 
      success: true, 
      verified: isValid,
      message: isValid ? 'OTP verified successfully' : 'Invalid OTP'
    };
  } catch (error) {
    console.error('Error verifying signup OTP:', error);
    throw error;
  }
};

/**
 * Send OTP for login
 * @param {string} phoneNumber - The phone number to send OTP to
 * @returns {Promise} - Promise resolving to API response
 */
export const sendLoginOTP = async (phoneNumber) => {
  try {
    // In a real implementation, this would call an SMS service
    // For now, we'll just generate and store the OTP locally
    const otp = generateOTP();
    storeOTP(phoneNumber, otp);
    
    console.log(`OTP for login: ${otp} sent to ${phoneNumber}`);
    
    // Mock API response
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Error sending login OTP:', error);
    throw error;
  }
};

/**
 * Verify OTP for login
 * @param {string} phoneNumber - The phone number to verify OTP for
 * @param {string} otp - The OTP to verify
 * @returns {Promise} - Promise resolving to API response
 */
export const verifyLoginOTP = async (phoneNumber, otp) => {
  try {
    const isValid = verifyOTP(phoneNumber, otp);
    
    return { 
      success: isValid,
      message: isValid ? 'OTP verified successfully' : 'Invalid OTP'
    };
  } catch (error) {
    console.error('Error verifying login OTP:', error);
    throw error;
  }
};