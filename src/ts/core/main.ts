import {addExtensions} from "../util/extensions/allExtensions";
import {MakeMakeFile} from "./MakeMakeFile";

addExtensions();

async function asyncMain(): Promise<void> {
    const makeMakeFile = await MakeMakeFile.new(__dirname);
    await makeMakeFile.create();
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