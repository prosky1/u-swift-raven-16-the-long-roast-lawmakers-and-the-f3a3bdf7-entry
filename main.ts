import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TEXT =
  "The committee asked an AI to draft the regulation, and the AI sent back a perfect PDF, which the chairman has double-clicked 47 times.";

// Runtime guard: the gate requires 1-320 UTF-8 characters, one sentence,
// nothing but whitespace-free text. Fail loudly instead of writing junk.
if (TEXT.length < 1 || TEXT.length > 320) {
  throw new Error(`entry length ${TEXT.length} outside 1-320 characters`);
}
if (TEXT.trim() !== TEXT) {
  throw new Error("entry must not start or end with whitespace");
}
const sentences = TEXT.split(/[.!?]+/).filter((s) => s.trim().length > 0);
if (sentences.length !== 1) {
  throw new Error(`expected exactly one sentence, found ${sentences.length}`);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", TEXT, "utf8");

// Byte-exact verification: read the file back and compare, so a silent
// write failure or encoding surprise can never ship a wrong entry.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== TEXT) {
  throw new Error("entry.txt does not match the intended text byte for byte");
}
console.log(`Wrote ${TEXT.length} characters to /output/entry.txt`);
