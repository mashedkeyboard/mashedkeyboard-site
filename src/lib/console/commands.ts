// Exports a map of all commands available to the modules that define them.

import * as commandModules from '$lib/console/src';
import type CommandClass from './commandclass';

let commands = new Map<string, CommandClass>();

Object.values(commandModules).forEach((commandClass) => {
	commandClass.getCommandNames().forEach((commandName: string) => {
		commands.set(commandName, commandClass);
	});
});

export default commands;
