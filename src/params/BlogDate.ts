export function match(param: string) {
	return /^\d{4,}\/\d{2}\/\d{2}$/.test(param);
}