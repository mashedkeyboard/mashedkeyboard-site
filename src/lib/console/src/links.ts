import { goto } from '$app/navigation';
import type CommandClass from '../commandclass';

/**
 * Links sends you out to various different parts of the site, or elsewhere.
 */
export const Links: CommandClass = class {
	static getCommandNames() {
		return ['goto'];
	}

	static processCommand(name: string, args: string[]) {
		switch (args[0]) {
			case 'home':
			case 'root':
			case '/':
				this.gotoInternal('/');
				break;
			case 'cv':
				this.gotoInternal('/cv');
				break;
			case 'mastodon':
			case 'masto':
			case 'social':
				window.location.href = 'https://social.mashed.cloud/@curtispf';
				break;
			default:
				return "I don't know how to send you there, sorry :(";
		}
		return 'Sending you there now...';
	}

	static getDescription() {
		return 'sends you to my CV or my mastodon';
	}

	static getHelp() {
		return 'goto will send you to a page relevant to the argument you give it. supported so far are "goto cv", "goto home", and variations of "goto mastodon".';
	}

	private static gotoInternal(path: string) {
		goto(path, { keepFocus: true });
	}
};
