import { use } from "react";

// services/auth/AuthValidationService.ts
export class AuthValidationService {
  // Validate email with regex
  static isValidEmail(email: string): boolean {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password (at least 8 chars, uppercase, lowercase, number, special char)
  static isValidPassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  }

  // Validate username (3–20 chars, alphanumeric and underscores allowed)
  static isValidUsername(username: string): boolean {
    const usernameRegex =
      /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }
 static validatePhoneNumber(phone: string): boolean {
  // Pakistani phone number format
  const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
}
  // Generic field empty check
  static isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
  }

  // Validate login form
  static validateLogin(email: string, password: string) {
    const errors: {email?: string, password?: string}= {};
    if (!this.isNotEmpty(email)) {
    errors.email = "Email is required.";
  } else if (!this.isValidEmail(email)) {
    errors.email = "Invalid email format.";
  }
    if (!this.isNotEmpty(password)) {
      errors.password="Password is required.";
    }

    return errors;
  }

  // Validate signup form
  static validateSignup(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string,
  confirm: string
) {
  const errors: {
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirm?: string;
  } = {};

  // First & Last Name
  if (!this.isNotEmpty(firstName)) {
    errors.username = "First name is required.";
  } else if (
    !this.isValidUsername(firstName) ||
    !this.isValidUsername(lastName)
  ) {
    errors.username =
      "Name must be 3–20 characters (letters, numbers, underscore).";
  }

  // Phone
  if (!this.isNotEmpty(phone)) {
    errors.phone = "Phone number is required.";
  } else if (!this.validatePhoneNumber(phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  // Email
  if (!this.isNotEmpty(email)) {
    errors.email = "Email is required.";
  } else if (!this.isValidEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }

  // Password
  if (!this.isNotEmpty(password)) {
    errors.password = "Password is required.";
  } else if (!this.isValidPassword(password)) {
    errors.password =
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
  }

  // Confirm Password
  if (!this.isNotEmpty(confirm)) {
    errors.confirm = "Confirm password is required.";
  } else if (password !== confirm) {
    errors.confirm = "Password and Confirm Password do not match.";
  }

  return errors;
}
}
