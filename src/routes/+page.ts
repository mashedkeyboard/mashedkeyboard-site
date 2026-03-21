/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	return {
		meta_title: `Hi! I'm cpf`,
		social_title: 'cpf.sh',
		description:
			'I\'m a software engineer, student paramedic, researcher, activist, and tech policy wonk. ' +
			'My website has my CV, blog, and links to my research.',
		open_graph_type: 'profile',
		open_graph: {
			'profile:first_name': 'C',
			'profile:last_name': 'Parfitt-Ford'
		}
	};
}
