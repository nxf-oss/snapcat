import { ValidationResult } from './types.js';
import { ValidatorLogger } from './validatorLogger.js';

export class CommonValidator {
	static validateString(value: any, fieldName: string = 'value'): ValidationResult {
		if (typeof value !== 'string') {
			return { isValid: false, error: `${fieldName} must be a string` };
		}

		if (value.length === 0) {
			return { isValid: false, error: `${fieldName} cannot be empty` };
		}

		return { isValid: true };
	}

	static validateNumber(value: any, fieldName: string = 'value'): ValidationResult {
		if (typeof value !== 'number' || !Number.isFinite(value)) {
			return { isValid: false, error: `${fieldName} must be a finite number` };
		}

		return { isValid: true };
	}

	static validatePositiveNumber(value: any, fieldName: string = 'value'): ValidationResult {
		const numberResult = this.validateNumber(value, fieldName);
		if (!numberResult.isValid) {
			return numberResult;
		}

		if (value < 0) {
			return { isValid: false, error: `${fieldName} must be a positive number` };
		}

		return { isValid: true };
	}

	static validateInteger(value: any, fieldName: string = 'value'): ValidationResult {
		const numberResult = this.validateNumber(value, fieldName);
		if (!numberResult.isValid) {
			return numberResult;
		}

		if (!Number.isInteger(value)) {
			return { isValid: false, error: `${fieldName} must be an integer` };
		}

		return { isValid: true };
	}

	static validateBoolean(value: any, fieldName: string = 'value'): ValidationResult {
		if (typeof value !== 'boolean') {
			return { isValid: false, error: `${fieldName} must be a boolean` };
		}

		return { isValid: true };
	}

	static validateArray(value: any, fieldName: string = 'value'): ValidationResult {
		if (!Array.isArray(value)) {
			return { isValid: false, error: `${fieldName} must be an array` };
		}

		return { isValid: true };
	}

	static validateObject(value: any, fieldName: string = 'value'): ValidationResult {
		if (typeof value !== 'object' || value === null) {
			return { isValid: false, error: `${fieldName} must be an object` };
		}

		return { isValid: true };
	}

	static validateEnum(
		value: any,
		allowedValues: any[],
		fieldName: string = 'value',
	): ValidationResult {
		if (!allowedValues.includes(value)) {
			return {
				isValid: false,
				error: `${fieldName} must be one of: ${allowedValues.join(', ')}`,
			};
		}

		return { isValid: true };
	}

	static validateRange(
		value: number,
		min: number,
		max: number,
		fieldName: string = 'value',
	): ValidationResult {
		const numberResult = this.validateNumber(value, fieldName);
		if (!numberResult.isValid) {
			return numberResult;
		}

		if (value < min || value > max) {
			return {
				isValid: false,
				error: `${fieldName} must be between ${min} and ${max}`,
			};
		}

		return { isValid: true };
	}
}
