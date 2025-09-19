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
  static validateSignup(username: string, email: string, password: string, confirm: string) {
  const errors: { username?: string; email?: string; password?: string; confirm?: string } = {};

  if (!this.isValidUsername(username)) {
    errors.username = "Username must be 3–20 characters (letters, numbers, underscore).";
  }

  if (!this.isValidEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!this.isValidPassword(password)) {
    errors.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
  }

  if (password !== confirm) {
    errors.confirm = "Password and Confirm Password do not match.";
  }

  return errors;
}

}
