<script lang="ts">
	import { type OgObject } from 'open-graph-scraper/types';

	interface Props {
		data: string;
		alt?: string;
	}

	let { data, alt = '' }: Props = $props();

	const ogData = JSON.parse(data) as OgObject;
</script>

<a href={ogData.ogUrl} target="_blank">
	<img
		src={ogData.ogImage?.[0]?.url}
		alt={alt || ogData.ogDescription || 'The Open Graph link image for this link.'} />
	<span>
		<span class="og-title">{ogData.ogTitle}</span>
		<span class="og-description">{ogData.ogDescription || ''}</span>
	</span>
</a>

<style lang="scss">
	a {
		display: block;
		width: 100%;
		overflow: hidden;

		img {
			max-width: 100%;
			display: block;
		}

		> span {
			background: $primary;
			color: $light;
			width: 100%;
			padding: 1em;
			display: block;

			.og-title {
				font-weight: bold;
				font-size: 1.3em;
				display: block;
			}

			.og-description {
				margin-bottom: 0;
			}
		}
	}
</style>
