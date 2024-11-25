import type CommandClass from '../commandclass';

/**
 * Blahaj will give you a beautiful ASCII art Blahaj.
 */
export const Blahaj: CommandClass = class {
	static getCommandNames() {
		return ['blahaj', 'shonk'];
	}

	static processCommand(name: string, args: string[]) {
		return `
       🟦🟦🟦🟦🟦➖🟦🟦
       ⬜🔳⬜🟦🟦🟦🟦🟦
       ➖⬜⬜⬜⬜🟦🟦
       ➖➖⬜⬜⬜⬜🟦🟦
       ➖🟦🟦➖⬜⬜🟦🟦
       ➖➖➖➖➖⬜🟦🟦
       ➖➖➖➖⬜🟦🟦
       ➖➖➖🟦⬜🟦
       ➖➖➖🟦🟦
       `;
	}

	static getDescription() {
		return 'you deserve a blahaj';
	}

	static getHelp() {
		return 'shows you a pretty picture of a blahaj! no arguments.';
	}
};
