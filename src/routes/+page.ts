/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	return {
		meta_title: `Hi! I'm Curtis Parfitt-Ford`,
		social_title: 'Curtis Parfitt-Ford',
		description:
			'Curtis is a software engineer, student paramedic, researcher, activist, and tech policy wonk. ' +
			'Their website has their CV, blog, and links to their research.',
		open_graph_type: 'profile',
		open_graph: {
			'profile:first_name': 'Curtis',
			'profile:last_name': 'Parfitt-Ford'
		}
	};
}
