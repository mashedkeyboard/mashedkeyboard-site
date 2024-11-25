import type CommandClass from '../commandclass';
import commands from '$lib/console/commands';
import * as commandModules from '$lib/console/src';

/**
 * Help offers help on the console commands available.
 */
export const Help: CommandClass = class {
	static getCommandNames() {
		return ['help'];
	}

	static processCommand(name: string, args: string[]) {
		if (args.length == 0) {
			let output: string = 'The available commands with a help document are listed below:';

			Object.values(commandModules).forEach((commandClass) => {
				if (commandClass.getHelp() !== false) {
					output +=
						'\n\n- ' +
						commandClass.getCommandNames().join(' or ') +
						': ' +
						commandClass.getDescription();
				}
			});

			output +=
				'\n\nMore may exist, but they may choose not to document themselves. To get a command\'s help information, run "help [command]".';

			return output;
		} else if (commands.get(args[0])?.getHelp()) {
			return commands.get(args[0])!.getHelp() as string;
		} else {
			return "That doesn't look like it's something I can help you with, sorry.";
		}
	}

	static getDescription() {
		return 'does what it says on the tin; gives you help';
	}

	static getHelp() {
		return 'help will list commands that have documentation. help [command] will show you the documentation for a specific command.';
	}
};
