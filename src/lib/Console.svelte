<script lang="ts">
	import { afterUpdate } from "svelte";
    import commands from '$lib/console/commands';
    import ConsoleLine from "./ConsoleLine";
    import type CommandClass from './console/commandclass';

    /**
     * Toggles whether the console should be open or closed.
	 * @type {boolean}
	 */
    export let showConsole = false;

    /**
     * The current command being written or run.
	 * @type {string}
	 */
    let currentCommand = "";

    /**
     * The history of executed commands.
	 * @type ConsoleLine[]
	 */
    let executed: ConsoleLine[] = [];

    /**
     * The console div.
	 * @type {HTMLDivElement}
	 */
    let console: HTMLDivElement;

    /**
     * Holds the index of the current command being browsed to in the command history.
     * 0 if no browsing session is in progress.
     * @type {Number}
     */
    let commandHistoryBrowserIndex = 0;

    /**
     * Handles a keypress in the command input box.
	 * @param {KeyboardEvent} e
	 */
    function handleKeypress(e: KeyboardEvent) {
        if (["ArrowUp", "ArrowDown"].includes(e.key)) {
            if (e.key === "ArrowUp") {
                if (commandHistoryBrowserIndex < executed.length) commandHistoryBrowserIndex += 1;
            } else if (commandHistoryBrowserIndex > 1) {
                commandHistoryBrowserIndex -= 1;
            }

            currentCommand = executed[executed.length - commandHistoryBrowserIndex].command;
        } else {
            commandHistoryBrowserIndex = 0;
        }

        if (e.key === "Enter" && currentCommand != "") {
            let output = "Command not recognised";
            
            let [command, ...args] = currentCommand.split(" ");

            if (commands.has(command)) {
                output = commands.get(command)!.processCommand(command, args);
            }

            executed.push(new ConsoleLine(currentCommand, output));
            executed = executed; // trigger assignment
            currentCommand = "";
        }
    }

    afterUpdate(() => {
        // Make sure the console is always scrolled to the bottom after using a new command
        if (console) console.scrollTop = console.scrollHeight;
    });
</script>

{#if showConsole}
<div class="console-overlay">
	<div class="console" bind:this={console}>
        <button on:click={e => showConsole = false}><i class="fa-solid fa-times" aria-hidden="true" title="Close the console"></i></button>
		<ul>
            {#each executed as execution}
                <li>
                    <div>{execution.command}</div>
                    <pre>{execution.output}</pre>
                </li>
            {/each}
        </ul>
        <!-- This is user-activated - we do want to take control of the tab order here -->
		<!-- svelte-ignore a11y-autofocus -->
		<input type="text" autofocus autocomplete="off" bind:value={currentCommand} on:keyup={handleKeypress} />
	</div>
</div>
{/if}

<style lang="scss">
    @import '../lib/scss/_variables';
    
	.console-overlay {
		position: absolute;
		z-index: 1000;
		width: 100%;
		height: 100%;
        color: #f2f2f2;

		.console {
			position: fixed;
			bottom: 0;
			left: 0;
			margin: 1em;
			width: calc(100% - 2em);

            background: rgba($primary_dark, 0.9);
            @media screen and (min-width: $desktop_break) {
                background: rgba(0, 0, 0, 0.7);
            }

            max-height: 95%;
            overflow-y: scroll;
            min-height: 50%;

            button {
                position: sticky;
                left: 100%;
                top: 2em;
                margin: 2em;
                text-transform: uppercase;
                color: #f2f2f2;
                border: 1px solid white;
                padding: 1em;
                background: none;
                transition: background 0.2s ease-in-out;
                cursor: pointer;

                &:hover {
                    background: $primary;
                }
            }

			ul {
				list-style: '$ ';
                font-family: 'Courier New', Courier, monospace;
                padding-bottom: 1.1em;

                pre {
                    white-space: pre-wrap;
                }
			}

			input {
				background: rgba(0, 0, 0, 0.2);
				border: transparent;
				width: 100%;
                padding: 0.4em;
                padding-left: 1em;
                width: calc(100% - 1.4em);
                position: sticky;
                bottom: 0;
                top: 100%;
                color: #ffffff;
			}
		}
	}
</style>
