export function match(param: string) {
	return /^\d{4,}$/.test(param);
}
