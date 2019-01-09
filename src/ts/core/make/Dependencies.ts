import * as fs from "fs-extra";
import {cmp} from "../../util/misc/compare";
import {path} from "../../util/polyfills/path";
import {MakeRule} from "./MakeMakeFile";

interface Dependency {
    readonly file: string;
    readonly local: boolean;
}

interface DependencyTree extends Dependency {
    readonly dependencies: DependencyTree[];
}

export interface Dependencies {
    readonly root: string;
    readonly files: ReadonlyArray<string>;
    readonly rules: ReadonlyArray<MakeRule>;
    readonly tree: DependencyTree;
}

function findDependencies(code: string): Dependency[] {
    return code.split("\n")
        .filter(s => s.includes("#include"))
        .mapFilter(line => {
            const localDependency = /"("*)"/.exec(line);
            if (localDependency) {
                return {
                    file: localDependency[1],
                    local: true,
                };
            }
            const systemDependency = /<("*)>/.exec(line);
            if (systemDependency) {
                return {
                    file: systemDependency[1],
                    local: false,
                };
            }
        });
}

export const Dependencies = {
    
    async new(root: string): Promise<Dependencies> {
        
        const dependencyCache: Map<string, DependencyTree> = new Map();
        
        async function followDependency({file, local}: Dependency): Promise<DependencyTree> {
            const dependencies = !local ? [] : await (async () => {
                const {dir} = path.parse(file);
                return await findDependencies((await fs.readFile(file)).toString())
                    .asyncMap(async ({file: fileName, local}) => {
                        const file = path.join(dir, fileName);
                        return dependencyCache.get(file) || await followDependency({file, local});
                    });
            })();
            return {
                file,
                local,
                dependencies,
            };
        }
        
        const tree = await followDependency({file: root, local: true});
        const dependencies = [...dependencyCache.values()]
            .filter(e => e.local)
            .sort(cmp.byString(e => e.file));
        
        // TODO when searching dependency tree, must also search .c files,
        // since only .h files will be #included
        
        return {
            root,
            files: dependencies.map(e => e.file),
            rules: dependencies.map(({file, local, dependencies}) => ({
                target: `${file}.o`,
                dependencies: dependencies.map(e => e.file),
                commands: [],
            } as MakeRule)),
            tree,
        };
    },
    
};