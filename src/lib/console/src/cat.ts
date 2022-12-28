import type CommandClass from '../commandclass';
import filesystem from './filesystem';
import type Folder from './filesystem/folder';
import { pathToDirectory } from './filesystem/tools';

/**
 * Cat prints objects in the filesystem.
 * Yes, I know that's technically a "useless use of cat".
 * No, I'm not sorry.
 */
export const Cat: CommandClass = class {
    static getCommandNames() {
        return ["cat"];
    }

    static processCommand(name: string, args: string[]) {
        let directory : Folder | null = filesystem;
        let path = args[0].split("/");

        if (args.length != 0) {
            // no, really, this does do the thing, I promise
            //@ts-ignore
            var _0x17ad11=_0x3c16;(function(_0x50695b,_0x2e2bd7){var _0x27f7a9=_0x3c16,_0x5b971d=_0x50695b();while(!![]){try{var _0x5071ed=-parseInt(_0x27f7a9(0xd9))/0x1*(parseInt(_0x27f7a9(0xd1))/0x2)+-parseInt(_0x27f7a9(0xd5))/0x3+parseInt(_0x27f7a9(0xd2))/0x4+parseInt(_0x27f7a9(0xe1))/0x5*(parseInt(_0x27f7a9(0xd6))/0x6)+-parseInt(_0x27f7a9(0xd7))/0x7+parseInt(_0x27f7a9(0xdc))/0x8+parseInt(_0x27f7a9(0xd3))/0x9*(-parseInt(_0x27f7a9(0xe0))/0xa);if(_0x5071ed===_0x2e2bd7)break;else _0x5b971d['push'](_0x5b971d['shift']());}catch(_0x202313){_0x5b971d['push'](_0x5b971d['shift']());}}}(_0x5e3b,0x450aa));function _0x3c16(_0x43bdad,_0x5df877){var _0x5e3b08=_0x5e3b();return _0x3c16=function(_0x3c16c3,_0x33e1c0){_0x3c16c3=_0x3c16c3-0xd1;var _0x877733=_0x5e3b08[_0x3c16c3];return _0x877733;},_0x3c16(_0x43bdad,_0x5df877);}function _0x5e3b(){var _0x2ed243=['\x38\x6b\x53\x76\x4c\x73\x55','\x35\x30\x37\x34\x37\x32\x6d\x55\x49\x50\x6c\x4b','\x39\x39\x38\x38\x32\x39\x44\x48\x51\x64\x51\x71','\x6d\x65\x6f\x77\x21\x21\x21\x31\x21\x20','\x33\x32\x35\x35\x37\x38\x61\x53\x4e\x4c\x66\x75','\x35\x39\x37\x36\x34\x38\x47\x68\x51\x71\x69\x79','\x32\x39\x34\x30\x35\x30\x34\x46\x79\x44\x78\x56\x76','\x28\x79\x6f\x75\x20\x66\x6f\x75\x6e\x64','\x37\x35\x37\x38\x71\x72\x5a\x4c\x50\x58','\x6f\x6e\x20\x6d\x61\x73\x74\x6f\x64\x6f','\x6d\x65\x6f\x77','\x33\x35\x31\x30\x30\x36\x34\x72\x73\x77\x51\x72\x6d','\x61\x20\x6d\x65\x73\x73\x61\x67\x65\x20','\x65\x61\x73\x74\x65\x72\x20\x65\x67\x67','\x2c\x20\x73\x65\x6e\x64\x20\x6d\x65\x20','\x32\x30\x66\x58\x59\x56\x48\x57','\x32\x35\x4b\x71\x75\x61\x64\x43','\x20\x74\x68\x65\x20\x72\x65\x61\x6c\x20'];_0x5e3b=function(){return _0x2ed243;};return _0x5e3b();}if(args[0x0]===_0x17ad11(0xdb))return _0x17ad11(0xd4)+_0x17ad11(0xd8)+_0x17ad11(0xe2)+_0x17ad11(0xde)+_0x17ad11(0xdf)+_0x17ad11(0xdd)+_0x17ad11(0xda)+'\x6e\x29';

            directory = pathToDirectory(path.slice(0, path.length - 1), directory);
            if (!directory) {
                return "Invalid path given";
            }
        }
        
        let file = directory[path[path.length - 1]];

        if (typeof file === "string") {
            return file;
        } else {
            return "File not found";
        }
    }

    static getDescription() {
        return "reads files";
    }

    static getHelp() {
        return false;
    }
};