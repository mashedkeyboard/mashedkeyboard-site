import type CommandClass from '../commandclass';
import filesystem from './filesystem';
import type Folder from './filesystem/folder';
import { pathToDirectory } from './filesystem/tools';

/**
 * FSList lists files in the "filesystem".
 */
export const FSList: CommandClass = class {
	static getCommandNames() {
		return ['ls'];
	}

	static processCommand(name: string, args: string[]) {
		let foundFiles: string[] = [];

		let directory: Folder | null = filesystem;

		if (args.length != 0) {
			directory = pathToDirectory(args[0].split('/'), directory);
			if (!directory) {
				return 'Invalid path given';
			}
		}

		Object.entries(directory).forEach(([file, contents]) => {
			foundFiles.push(file + (typeof contents === 'object' ? '/' : ''));
		});

		return foundFiles.join('\n');
	}

	static getDescription() {
		return 'lists files';
	}

	static getHelp() {
		return 'ls will list files in the current directory; ls [directory] will list those in that directory instead';
	}
};
