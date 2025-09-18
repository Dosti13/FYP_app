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
  static validateLogin(email: string, password: string): string[] {
    const errors: string[] = [];

    if (!this.isValidEmail(email)) {
      errors.push("Invalid email format.");
    }
    if (!this.isNotEmpty(password)) {
      errors.push("Password is required.");
    }

    return errors;
  }

  // Validate signup form
  static validateSignup(username: string, email: string, password: string ,cnfrm:String) : string[] {
    const errors: string[] = [];

    if (!this.isValidUsername(username)) {
      errors.push("Username must be 3–20 characters (letters, numbers, underscore).");
    }
    if (!this.isValidEmail(email)) {
      errors.push("Invalid email format.");
    }
    if (!this.isValidPassword(password)) {
      errors.push(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      if(password!=cnfrm){
        errors.push("Password and Confirm Password do not match.");
      }
    }

    return errors;
  }
}
