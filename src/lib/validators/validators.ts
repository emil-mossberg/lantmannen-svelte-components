export type Validator = (value: any) => string | null;

// TO DO add my own, most likely dont need all
export const required = (message = 'This field is required'): Validator => (value) =>
	value == null || value === '' ? message : null;

export const minLength = (min: number, message?: string): Validator => (value) =>
	value.length < min ? message ?? `Must be at least ${min} characters` : null;

export const isMultipleOf = (step: number, message?: string): Validator => (value) =>
	value % step !== 0 ? message ?? `Must be a multiple of ${step}` : null;

export const min = (minVal: number, message?: string): Validator => (value) =>
	value < minVal ? message ?? `Must be at least ${minVal}` : null;

export const combine = (...validators: Validator[]): Validator => (value) => {
	for (const v of validators) {
		const result = v(value);
		if (result) return result;
	}
	return null;
};