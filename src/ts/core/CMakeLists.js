"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
async function updateCMakeLists(dir, dependencies) {
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
exports.updateCMakeLists = updateCMakeLists;
//# sourceMappingURL=CMakeLists.js.map