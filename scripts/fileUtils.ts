// File discovery and reading helpers for batch parsing
import { promises as fs } from "fs";
import * as path from "path";

/**
 * Recursively find all files with a given extension in a directory.
 * @param dir - Directory to search
 * @param ext - File extension (e.g., ".twee")
 * @returns Array of absolute file paths
 */
export async function findExampleFiles(
	dir: string,
	ext = ".twee",
): Promise<string[]> {
	let results: string[] = [];
	const entries = await fs.readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results = results.concat(await findExampleFiles(fullPath, ext));
		} else if (entry.isFile() && entry.name.endsWith(ext)) {
			results.push(fullPath);
		}
	}
	return results;
}

/**
 * Read a file as UTF-8 text.
 * @param filePath - Path to file
 * @returns File contents as string
 */
export async function readFile(filePath: string): Promise<string> {
	return fs.readFile(filePath, "utf8");
}
