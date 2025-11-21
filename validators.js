// validators.js - Customer field validation utilities

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (!email) return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (basic - allows digits, spaces, hyphens, +)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
function isValidPhoneFormat(phone) {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate that required name fields are provided
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {object} - { valid: boolean, error?: string }
 */
function validateNames(firstName, lastName) {
  if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
    return { valid: false, error: 'first_name is required and must be a non-empty string' };
  }
  if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
    return { valid: false, error: 'last_name is required and must be a non-empty string' };
  }
  return { valid: true };
}

/**
 * Validate loan numeric fields
 * @param {number} loanAmount - Loan amount
 * @param {number} interestRate - Interest rate
 * @param {number} loanTerm - Loan term in days
 * @returns {object} - { valid: boolean, error?: string }
 */
function validateLoanAmounts(loanAmount, interestRate, loanTerm) {
  if (!loanAmount || isNaN(parseFloat(loanAmount)) || parseFloat(loanAmount) <= 0) {
    return { valid: false, error: 'loan_amount must be a positive number' };
  }
  if (!interestRate || isNaN(parseFloat(interestRate)) || parseFloat(interestRate) < 0) {
    return { valid: false, error: 'interest_rate must be a non-negative number' };
  }
  if (!loanTerm || !Number.isInteger(parseInt(loanTerm)) || parseInt(loanTerm) < 0) {
    return { valid: false, error: 'loan_term must be a non-negative integer' };
  }
  return { valid: true };
}

/**
 * Convert camelCase to snake_case
 * @param {string} str - String to convert
 * @returns {string}
 */
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Convert snake_case to camelCase
 * @param {string} str - String to convert
 * @returns {string}
 */
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Map request body (camelCase or snake_case) to database fields (snake_case)
 * Handles both naming conventions
 * @param {object} body - Request body
 * @returns {object} - Mapped fields
 */
function mapRequestToDb(body) {
  const fieldMappings = {
    'firstName': 'first_name',
    'lastName': 'last_name',
    'homePhone': 'home_phone',
    'mobilePhone': 'mobile_phone',
    'birthDate': 'birthdate',
    'identificationInfo': 'identification_info',
    'loanAmount': 'loan_amount',
    'interestRate': 'interest_rate',
    'loanIssuedDate': 'loan_issued_date',
    'loanTerm': 'loan_term',
    'customerNumber': 'customer_number',
    'customerName': 'customer_name',
    'collateralDescription': 'collateral_description',
    'customerNote': 'customer_note',
    'transactionNumber': 'transaction_number',
    'userId': 'user_id',
  };

  const mapped = {};

  for (const [key, value] of Object.entries(body)) {
    // Check if it's camelCase
    const snakeKey = fieldMappings[key] || camelToSnake(key);
    mapped[snakeKey] = value;
  }

  return mapped;
}

/**
 * Convert database fields (snake_case) to response format (snake_case for API)
 * @param {object} loanObject - Loan object from database
 * @returns {object} - Formatted loan object
 */
function formatLoanResponse(loanObject) {
  const formatted = { ...loanObject };

  // Ensure all response fields are in snake_case
  const snakeCaseFields = [
    'first_name', 'last_name', 'home_phone', 'mobile_phone', 'birthdate',
    'referral', 'identification_info', 'address', 'customer_name', 'customer_number',
    'loan_amount', 'interest_rate', 'interest_amount', 'total_payable_amount',
    'loan_issued_date', 'loan_term', 'due_date', 'transaction_number',
    'collateral_description', 'customer_note', 'remaining_balance', 'created_by'
  ];

  // Remove any camelCase versions if they exist
  for (const key of Object.keys(formatted)) {
    if (!snakeCaseFields.includes(key) && key.includes('_') === false) {
      delete formatted[key];
    }
  }

  return formatted;
}

module.exports = {
  isValidEmail,
  isValidPhoneFormat,
  validateNames,
  validateLoanAmounts,
  camelToSnake,
  snakeToCamel,
  mapRequestToDb,
  formatLoanResponse,
};
