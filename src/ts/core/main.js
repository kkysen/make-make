"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allExtensions_1 = require("../util/extensions/allExtensions");
const MakeMakeFile_1 = require("./MakeMakeFile");
allExtensions_1.addExtensions();
async function asyncMain() {
    const makeMakeFile = await MakeMakeFile_1.MakeMakeFile.new(__dirname);
    await makeMakeFile.create();
}
function main() {
    (async () => {
        try {
            await asyncMain();
        }
        catch (e) {
            console.error(e);
        }
    })();
}
main();
//# sourceMappingURL=main.js.map