"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allExtensions_1 = require("../util/extensions/allExtensions");
const Dir_1 = require("../util/io/Dir");
const generateHashMap_1 = require("./generate/generateHashMap");
const Type_1 = require("./generate/Type");
allExtensions_1.addExtensions();
async function asyncMain() {
    // const makeMakeFile = await MakeMakeFile.new(__dirname);
    // await makeMakeFile.create();
    const key = Type_1.Type.new("String *", s => `String_hash(${s})`, (s1, s2) => `String_equals(${s1}, ${s2})`);
    const value = Type_1.Type.new("Addr2Line *", _ => `(u64) ${_}->fd`);
    const generator = generateHashMap_1.generateHashMap(key, value);
    const collectionsDir = Dir_1.Dir.of("C:/Users/Khyber/workspace/LibCKhyber/src2/collections");
    const dir = collectionsDir.dir("HashMap");
    await dir.ensureCreated();
    await generator(dir);
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