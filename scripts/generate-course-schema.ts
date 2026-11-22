import { mkdir, writeFile } from "node:fs/promises";
import { zodToJsonSchema } from "zod-to-json-schema";
import { courseSpecSchema } from "../src/schema/course-spec.js";

const jsonSchema = zodToJsonSchema(courseSpecSchema, {
  name: "COURSE-SPEC",
  target: "jsonSchema7",
});

const schemaContent = `${JSON.stringify(jsonSchema, null, 2)}\n`;

await writeFile(
  new URL("../schemas/course-spec.v1.schema.json", import.meta.url),
  schemaContent,
  "utf8",
);

try {
  await mkdir(new URL("../.speclearn", import.meta.url), { recursive: true });
  await writeFile(
    new URL("../.speclearn/course-spec.v1.schema.json", import.meta.url),
    schemaContent,
    "utf8",
  );
} catch {
  // Ignore if .speclearn cannot be written
}
