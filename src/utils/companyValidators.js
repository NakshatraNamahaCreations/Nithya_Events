// Shared company-field validators (company name, designation, PAN, GST, CIN).
// Mirrors the rules used on the registration CompanyDetails form so the Account
// profile page validates identically. Each validator returns an array of error
// strings (empty = valid); callers typically show the first one.

export const MIN_COMPANY_CHARS = 2;
export const MAX_COMPANY_CHARS = 100;
export const MIN_DESIG_CHARS = 2;
export const MAX_DESIG_CHARS = 50;

const RE_ALPHA_SPACE = /^[A-Za-z ]+$/;
const RE_PAN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const RE_GST_SHAPE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/;
const RE_CIN_ALNUM = /^[A-Z0-9]+$/;
const RE_CIN_SHAPE = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

const STATE_CODES = new Set([
  "AP", "AR", "AS", "BR", "CG", "GA", "GJ", "HR", "HP", "JH", "JK", "KA",
  "KL", "LD", "MH", "ML", "MN", "MP", "MZ", "NL", "OD", "PB", "PY", "RJ",
  "SK", "TN", "TS", "TR", "UK", "UP", "WB", "AN", "CH", "DN", "DD", "DL",
  "LA",
]);

const CIN_COMPANY_TYPES = new Set([
  "PLC", "PTC", "NPL", "GAP", "GOV", "SGC", "FTC", "OPC", "ULL",
]);

// Trim ends and collapse internal multi-spaces to a single space.
export const smartTrim = (s = "") => s.replace(/\s+/g, " ").trim();

// GSTIN checksum per spec.
const gstChecksumValid = (gstin) => {
  const baseChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const codePoint = (c) => baseChars.indexOf(c);
  const weights = [1, 2];
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const cp = codePoint(gstin[i]);
    const w = weights[i % 2];
    const p = cp * w;
    sum += Math.floor(p / 36) + (p % 36);
  }
  const checkCode = (36 - (sum % 36)) % 36;
  return codePoint(gstin[14]) === checkCode;
};

export const validateCompanyName = (raw) => {
  const errors = [];
  if (raw && raw.trim() === "") {
    errors.push("Invalid name");
    return errors;
  }
  const v = smartTrim(raw);
  if (!v) {
    errors.push("Company Name is required");
    return errors;
  }
  if (v.length < MIN_COMPANY_CHARS) errors.push("Minimum length not met");
  if (v.length > MAX_COMPANY_CHARS) errors.push("Maximum length exceeded");
  if (!RE_ALPHA_SPACE.test(v)) {
    if (/\d/.test(v)) errors.push("Numbers not allowed");
    else errors.push("Special characters not allowed");
  }
  return errors;
};

export const validateDesignation = (raw) => {
  const errors = [];
  if (raw && raw.trim() === "") {
    errors.push("Invalid designation");
    return errors;
  }
  const v = smartTrim(raw);
  if (!v) {
    errors.push("Designation is required");
    return errors;
  }
  if (v.length < MIN_DESIG_CHARS) errors.push("Minimum length not met");
  if (v.length > MAX_DESIG_CHARS) errors.push("Maximum length exceeded");
  if (!RE_ALPHA_SPACE.test(v)) {
    if (/\d/.test(v)) errors.push("Numbers not allowed");
    else errors.push("Special characters not allowed");
  }
  return errors;
};

export const validatePAN = (raw) => {
  const errors = [];
  const v = (raw || "").toUpperCase().replace(/\s+/g, "");
  if (!v) {
    errors.push("PAN number is required");
    return errors;
  }
  if (v.length !== 10) {
    errors.push(
      v.length < 10 ? "PAN must be 10 characters" : "PAN must be exactly 10 characters"
    );
    return errors;
  }
  if (!RE_PAN.test(v)) {
    if (/[^A-Z0-9]/.test(v)) errors.push("Invalid characters not allowed");
    else errors.push("Invalid PAN format");
  }
  return errors;
};

export const validateGST = (raw) => {
  const errors = [];
  const v = (raw || "").toUpperCase().trim();
  if (!v) {
    errors.push("GST Number is required");
    return errors;
  }
  if (/\s/.test(v)) {
    errors.push("Spaces not allowed");
    return errors;
  }
  if (/[^A-Z0-9]/.test(v)) {
    errors.push("Special characters not allowed");
    return errors;
  }
  if (v.length !== 15) {
    errors.push("GST Number must be 15 characters");
    return errors;
  }
  if (!RE_GST_SHAPE.test(v)) {
    errors.push("Invalid GST Format");
    return errors;
  }
  if (!gstChecksumValid(v)) errors.push("Invalid GST Number");
  return errors;
};

export const validateCIN = (raw) => {
  const v = (raw || "").toUpperCase().trim();
  const errors = [];
  if (!v) {
    errors.push("CIN Number is required");
    return errors;
  }
  if (/\s/.test(v)) {
    errors.push("Spaces not allowed");
    return errors;
  }
  if (!RE_CIN_ALNUM.test(v)) {
    errors.push("Invalid CIN Format");
    return errors;
  }
  if (v.length !== 21) {
    errors.push("CIN must be 21 characters");
    return errors;
  }
  if (!RE_CIN_SHAPE.test(v)) {
    errors.push("Invalid CIN Format");
    return errors;
  }
  if (!STATE_CODES.has(v.slice(6, 8))) errors.push("Invalid State Code");
  if (!CIN_COMPANY_TYPES.has(v.slice(12, 15)))
    errors.push("Invalid Company Type");
  return errors;
};

// Company type options offered in the dropdown.
export const COMPANY_TYPES = [
  "Proprietorship",
  "Partnership",
  "Private Limited",
  "Public Limited",
  "LLP",
  "NGO",
];
