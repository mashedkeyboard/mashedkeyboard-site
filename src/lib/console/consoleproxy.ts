/**
 * ConsoleProxy facilitates communication between the console and the commands.
 */
export class ConsoleProxy {
	/**
	 * closer is a function that closes the console.
	 */
	private closer: () => void;

	constructor(closer: () => void) {
		this.closer = closer;
	}

	/**
	 * Closes the console.
	 */
	closeConsole() {
		this.closer();
	}
}
