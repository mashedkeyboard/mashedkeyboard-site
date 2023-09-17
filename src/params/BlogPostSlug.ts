export function match(param: string) {
	return /^[A-Za-z-_!]+$/.test(param);
}