/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	return {
		meta_title: `Hi! I'm Curtis Parfitt-Ford`,
		social_title: 'Curtis Parfitt-Ford',
		description:
			'Curtis Parfitt-Ford is a UK-based developer, tech policy wonk, communications nerd and activist.',
		open_graph_type: 'profile',
		open_graph: {
			'profile:first_name': 'Curtis',
			'profile:last_name': 'Parfitt-Ford'
		}
	};
}
