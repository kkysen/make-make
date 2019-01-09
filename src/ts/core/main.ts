import {addExtensions} from "../util/extensions/allExtensions";
import {Dir} from "../util/io/Dir";
import {generateHashMap} from "./generate/generateHashMap";
import {Type} from "./generate/Type";

addExtensions();

async function asyncMain(): Promise<void> {
    // const makeMakeFile = await MakeMakeFile.new(__dirname);
    // await makeMakeFile.create();
    const key = Type.new("String *",
        s => `String_hash(${s})`,
        (s1, s2) => `String_equals(${s1}, ${s2})`);
    const value = Type.new("Addr2Line *",
        _ => `(u64) ${_}->fd`,
    );
    const generator = generateHashMap(key, value);
    const collectionsDir = Dir.of("C:/Users/Khyber/workspace/LibCKhyber/src2/collections");
    const dir = collectionsDir.dir("HashMap");
    await dir.ensureCreated();
    await generator(dir);
}

function main(): void {
    (async () => {
        try {
            await asyncMain();
        } catch (e) {
            console.error(e);
        }
    })();
}

main();