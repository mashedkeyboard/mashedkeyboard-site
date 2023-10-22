export function match(param: string) {
	return /([\w_]+)/.test(param);
}