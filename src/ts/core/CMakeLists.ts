import * as fs from "fs-extra";
import {Dir} from "../util/io/Dir";
import {Dependencies} from "./Dependencies";

export async function updateCMakeLists(dir: Dir, dependencies: Dependencies): Promise<void> {
    const file = dir.fileToCreate("CMakeLists.txt", async () => {
        const sourceFiles = dependencies.files
            .filter(file => file !== dependencies.root)
            .join("\n" + " ".repeat(4));
        if (!fs.pathExists(file.path)) {
            return ``;
        }
        return ``; // TODO
    });
    
}