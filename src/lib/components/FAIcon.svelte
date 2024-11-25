<script lang="ts">
	import { icon as iconCore } from '@fortawesome/fontawesome-svg-core';
	import { config } from '@fortawesome/fontawesome-svg-core';
	import type { IconDefinition, IconParams } from '@fortawesome/fontawesome-svg-core';
	import '@fortawesome/fontawesome-svg-core/styles.css';

	config.autoAddCss = false;

	interface Props {
		icon: IconDefinition;
		opts?: IconParams;
	}

	let { icon, opts = {} }: Props = $props();
</script>

{@html iconCore(icon, opts)?.html}
