import type Folder from './folder';

export function pathToDirectory(path: string[], root: Folder): Folder | null {
	let directory = root;

	let lastPath;
	while ((lastPath = path.shift())) {
		if (typeof directory[lastPath] === 'object') {
			directory = directory[lastPath] as Folder;
		} else {
			return null;
		}
	}

	return directory as Folder;
}
