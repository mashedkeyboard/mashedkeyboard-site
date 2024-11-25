/**
 * A ConsoleLine is a line in the Console, with a command and its generated output.
 */
export default class ConsoleLine {
	/**
	 * command is the command that was executed
	 */
	command: string;
	/**
	 * output is the output of the command
	 */
	output: string;

	constructor(command: string, output: string) {
		this.command = command;
		this.output = output;
	}
}
