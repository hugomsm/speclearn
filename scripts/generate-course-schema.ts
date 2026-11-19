import { writeFile } from "node:fs/promises";
import { zodToJsonSchema } from "zod-to-json-schema";
import { courseSpecSchema } from "../src/schema/course-spec.js";

const jsonSchema = zodToJsonSchema(courseSpecSchema, {
  name: "COURSE-SPEC",
  target: "jsonSchema7",
});

await writeFile(
  new URL("../schemas/course-spec.v1.schema.json", import.meta.url),
  `${JSON.stringify(jsonSchema, null, 2)}\n`,
  "utf8",
);
