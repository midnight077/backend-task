import { createReadStream } from "fs";
import { createInterface } from "readline";

export async function* readFileLineByLine(filename) {
    const fileStream = createReadStream(filename);
    const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    for await (const line of rl) {
        yield line;
    }
}
