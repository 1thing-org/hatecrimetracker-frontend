import { storage } from "../firebase";

const VIDEO_EXTENSIONS = new Set([
	"mp4", "mov", "m4v", "avi", "wmv", "mkv", "webm", "3gp",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const getFileExtension = (fileName) => {
	if (!fileName) return "";
	const dot = fileName.lastIndexOf(".");
	if (dot === -1 || dot === fileName.length - 1) return "";
	return fileName.slice(dot + 1).toLowerCase();
};

const isVideoFile = (file) => {
	if (file && file.type && file.type.startsWith("video/")) return true;
	return VIDEO_EXTENSIONS.has(getFileExtension(file && file.name));
};

const yearMonthFolder = () => {
	const now = new Date();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	return `${now.getFullYear()}-${month}`;
};

const randomId = () => {
	if (typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

/**
 * Upload a single File (from a file input) to the same Firebase Storage layout
 * the mobile self-report flow uses, and resolve to its public download URL.
 *
 * Throws if the file is over the 10 MB limit.
 */
export async function uploadAttachment(file) {
	if (!file) throw new Error("No file provided");
	if (file.size > MAX_FILE_SIZE) {
		throw new Error(
			`${file.name || "File"} is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). ` +
			`Maximum is 10 MB.`
		);
	}

	const isVideo = isVideoFile(file);
	const folder = isVideo ? "videos" : "images";
	const ext = getFileExtension(file.name) || (isVideo ? "mp4" : "bin");
	const path = `selfreport/${yearMonthFolder()}/${folder}/${randomId()}.${ext}`;

	const ref = storage.ref().child(path);
	const metadata = {
		contentType: file.type || (isVideo ? `video/${ext}` : `image/${ext}`),
		customMetadata: { originalFileName: file.name || "" },
	};

	const snapshot = await ref.put(file, metadata);
	return snapshot.ref.getDownloadURL();
}

/**
 * Upload many files in parallel. Resolves to { urls, errors } so callers can
 * surface partial failures without dropping the successful uploads.
 */
export async function uploadAttachments(files) {
	const results = await Promise.allSettled((files || []).map(uploadAttachment));
	const urls = [];
	const errors = [];
	results.forEach((r, i) => {
		if (r.status === "fulfilled") {
			urls.push(r.value);
		} else {
			const name = (files[i] && files[i].name) || `file ${i + 1}`;
			errors.push(`${name}: ${(r.reason && r.reason.message) || r.reason}`);
		}
	});
	return { urls, errors };
}
