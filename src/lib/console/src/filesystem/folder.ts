// Files in the filesystem are represented as strings.
// Folders are represented as these objects.
export default class Folder implements Record<string, string | Folder> {
	[x: string]: string | Folder;
}
