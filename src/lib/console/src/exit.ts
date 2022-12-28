import type CommandClass from '../commandclass';
import type { ConsoleProxy } from '../consoleproxy';

/**
 * Exit exits the console.
 */
export const Exit: CommandClass = class {
    static getCommandNames() {
        return ["exit"];
    }

    static processCommand(name: string, args: string[], proxy: ConsoleProxy) {
       proxy.closeConsole();
       return "";
    }

    static getDescription() {
        return "closes the console";
    }

    static getHelp() {
        return "closes the console. no arguments.";
    }
};