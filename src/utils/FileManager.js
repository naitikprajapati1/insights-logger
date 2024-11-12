import { createWriteStream, existsSync, mkdirSync } from "fs";
import { dirname } from "path";

export class FileManager {
	constructor(basePath = "logs") {
		this.basePath = basePath;
		this.streams = new Map();
		this.initializeDirectory();
	}

	initializeDirectory() {
		if (!existsSync(this.basePath)) {
			mkdirSync(this.basePath, { recursive: true });
		}
	}

	getStream(type) {
		if (!this.streams.has(type)) {
			const filePath = `${this.basePath}/${type}-${
				new Date().toISOString().split("T")[0]
			}.log`;
			this.streams.set(type, createWriteStream(filePath, { flags: "a" }));
		}
		return this.streams.get(type);
	}

	writeLog(type, message) {
		const stream = this.getStream(type);
		stream.write(message + "\n");
	}

	closeAll() {
		for (const stream of this.streams.values()) {
			stream.end();
		}
		this.streams.clear();
	}
}
