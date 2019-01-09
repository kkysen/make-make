"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const Dir_1 = require("../../util/io/Dir");
const CMakeLists_1 = require("./CMakeLists");
const Dependencies_1 = require("./Dependencies");
const defaultVariables = {
    MAIN: "main",
    CC: "gcc",
    CFLAGS: "-std=c11 -g -ggdb -Wall -Werror -Wextra -O3 -march=native -flto",
    LFLAGS: "-g -flto",
    LDFLAGS: "",
};
const linkLibraries = {
    math: "m",
};
function* findRules(lines) {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.includes(":")) {
            continue;
        }
        const [targets, dependencies] = line.split(":")
            .map(s => s.split(/\s+/).filter(Boolean));
        const commands = [
            ...(function* () {
                while (++i < lines.length) {
                    const line = lines[i];
                    if (line[0] === "\t") {
                        yield line;
                    }
                }
            })()
        ].map(s => s.trim());
        for (const target of targets) {
            yield {
                target,
                dependencies,
                commands,
            };
        }
    }
}
function makeRuleToString({ target, dependencies, commands }) {
    return [`${target}: ${dependencies.join(" ")}`, ...commands].join("\n\t");
}
function makeFileToString({ variables, rules }) {
    const variablesString = Object.entries(variables)
        .map(([name, value]) => `${name} = ${value}`).join("\n");
    return [variablesString, ...rules.map(makeRuleToString)].join("\n\n");
}
exports.MakeMakeFile = {
    async new(dirPath) {
        const dir = Dir_1.Dir.of(dirPath);
        const file = dir.file("Makefile");
        const buffer = await fs.readFile(file);
        const content = buffer.toString();
        const lines = content.split("\n");
        const variables = {
            ...defaultVariables,
            ...lines
                .filter(s => s.includes("="))
                .map(s => s.split("="))
                .filter(a => a.length === 2)
                ._()
                .toObject(),
        };
        const main = variables.main;
        const mainTarget = main.slice(0, main.lastIndexOf("."));
        const dependencies = await Dependencies_1.Dependencies.new(dir.file(main));
        const rules = [
            ...[...findRules(lines)]
                .filter(rule => rule.target.includes(".o") || rule.target === mainTarget),
            ...dependencies.rules,
        ];
        const toString = () => makeFileToString({ variables, rules });
        const makeFile = dir.fileToCreate("Makefile", toString);
        const create = async () => {
            await Promise.all([makeFile.create(), CMakeLists_1.updateCMakeLists(dir, dependencies)]);
        };
        return {
            dir,
            variables,
            main,
            rules,
            toString,
            create,
        };
    },
};
//# sourceMappingURL=MakeMakeFile.js.map