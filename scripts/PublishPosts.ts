import { writeFile } from 'fs';
import Matter from 'gray-matter';
import DirTree from 'directory-tree';

console.log(`Publishing for hostname ${process.env.PUBLIC_HOSTNAME}`);

console.log('Loading posts...');
DirTree('./posts', { extensions: /\.svx/ }, (item) => {
	if (!/\d{4}\/\d{2}\/\d{2}/.test(item.path)) {
		console.log(`Ignoring ${item.path}`);
		return;
	}

	console.log(`Considering post ${item.path}:`);

	const filename = `./${item.path}`;

	const file = Matter.read(filename);
	if (file.data.mastodon_post) {
		console.log(`Post already published, ignoring`);
	} else {
		console.log(`Publishing...`);

		const formData = new FormData();
		formData.append(
			'source',
			`https://${process.env.PUBLIC_HOSTNAME}/${item.path
				.replace('posts', 'blog')
				.replace('.svx', '')}`
		);
		formData.append('target', 'https://brid.gy/publish/mastodon');

		fetch('https://brid.gy/publish/webmention', {
			method: 'POST',
			body: formData
		}).then((resp) => {
			resp.json().then((resp) => {
				console.log(`Writing...`);

				if (resp.error || !resp.url) {
					console.log(resp.error);
					return;
				}

				file.data.mastodon_post = resp.url;

				writeFile(filename, Matter.stringify(file, file.data), 'utf8', function (err) {
					if (err) return console.log(err);
				});
			});
		});
	}
});
