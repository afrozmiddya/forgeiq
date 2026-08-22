export type ValidationErrorCode = 
  | 'ERR_INVALID_UOM'
  | 'ERR_NOT_IN_LOV'
  | 'ERR_CHAR_LIMIT_EXCEEDED'
  | 'ERR_REQUIRED_FIELD_MISSING'
  | 'ERR_INVALID_TYPE';

export interface ValidationError {
  code: ValidationErrorCode;
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
