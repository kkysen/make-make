"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const compare_1 = require("../../util/misc/compare");
const path_1 = require("../../util/polyfills/path");
function findDependencies(code) {
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
exports.Dependencies = {
    async new(root) {
        const dependencyCache = new Map();
        async function followDependency({ file, local }) {
            const dependencies = !local ? [] : await (async () => {
                const { dir } = path_1.path.parse(file);
                return await findDependencies((await fs.readFile(file)).toString())
                    .asyncMap(async ({ file: fileName, local }) => {
                    const file = path_1.path.join(dir, fileName);
                    return dependencyCache.get(file) || await followDependency({ file, local });
                });
            })();
            return {
                file,
                local,
                dependencies,
            };
        }
        const tree = await followDependency({ file: root, local: true });
        const dependencies = [...dependencyCache.values()]
            .filter(e => e.local)
            .sort(compare_1.cmp.byString(e => e.file));
        // TODO when searching dependency tree, must also search .c files,
        // since only .h files will be #included
        return {
            root,
            files: dependencies.map(e => e.file),
            rules: dependencies.map(({ file, local, dependencies }) => ({
                target: `${file}.o`,
                dependencies: dependencies.map(e => e.file),
                commands: [],
            })),
            tree,
        };
    },
};
//# sourceMappingURL=Dependencies.js.map