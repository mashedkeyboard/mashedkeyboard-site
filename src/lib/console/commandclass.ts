import type { ConsoleProxy } from './consoleproxy';

/**
 * CommandClass is the generic interface which all command classes for the console must implement.
 */
export default interface CommandClass {
	/**
	 * getCommandNames is called to get a list of command names
	 * that this module can process (e.g. ["help"]).
	 */
	getCommandNames(): string[];

	/**
	 * Processes a run command and returns the output
	 * @param name the name of the command executed
	 * @param args the list of arguments given to the command
	 * @param proxy the ConsoleProxy to allow the command to interface with the console
	 */
	processCommand(name: string, args: string[], proxy: ConsoleProxy): string;

	/**
	 * Gets a description for a command.
	 */
	getDescription(): string;

	/**
	 * Gets help for the command.
	 * Return false to opt out of documentation.
	 */
	getHelp(): string | boolean;
}
