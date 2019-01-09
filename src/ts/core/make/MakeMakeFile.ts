import * as fs from "fs-extra";
import {Dir} from "../../util/io/Dir";
import {Creator} from "../../util/io/FileToCreate";
import {updateCMakeLists} from "./CMakeLists";
import {Dependencies} from "./Dependencies";

export interface MakeRule {
    readonly target: string;
    readonly dependencies: ReadonlyArray<string>;
    readonly commands: ReadonlyArray<string>;
}

type MakeVariables = {[key: string]: string};

interface MakeFile {
    readonly variables: MakeVariables;
    readonly rules: ReadonlyArray<MakeRule>;
}

export interface MakeMakeFile extends MakeFile, Creator {
    readonly dir: Dir;
    readonly main: string;
    readonly toString: () => string;
}

const defaultVariables: MakeVariables = {
    MAIN: "main",
    CC: "gcc",
    CFLAGS: "-std=c11 -g -ggdb -Wall -Werror -Wextra -O3 -march=native -flto",
    LFLAGS: "-g -flto",
    LDFLAGS: "",
};

type LinkLibraries = {[key: string]: string};

const linkLibraries: LinkLibraries = {
    math: "m",
};

function* findRules(lines: string[]): IterableIterator<MakeRule> {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.includes(":")) {
            continue;
        }
        const [targets, dependencies] = line.split(":")
            .map(s => s.split(/\s+/).filter(Boolean));
        
        const commands: string[] = [
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

function makeRuleToString({target, dependencies, commands}: MakeRule): string {
    return [`${target}: ${dependencies.join(" ")}`, ...commands].join("\n\t");
}

function makeFileToString({variables, rules}: MakeFile): string {
    const variablesString = Object.entries(variables)
        .map(([name, value]) => `${name} = ${value}`).join("\n");
    return [variablesString, ...rules.map(makeRuleToString)].join("\n\n");
}

export const MakeMakeFile = {
    
    async new(dirPath: string): Promise<MakeMakeFile> {
        const dir: Dir = Dir.of(dirPath);
        
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
                ._<[string, string]>()
                .toObject(),
        };
        const main = variables.main;
        const mainTarget = main.slice(0, main.lastIndexOf("."));
        const dependencies = await Dependencies.new(dir.file(main));
        const rules = [
            ...[...findRules(lines)]
                .filter(rule => rule.target.includes(".o") || rule.target === mainTarget),
            ...dependencies.rules,
        ];
        
        const toString = () => makeFileToString({variables, rules});
        const makeFile = dir.fileToCreate("Makefile", toString);
        const create = async () => {
            await Promise.all([makeFile.create(), updateCMakeLists(dir, dependencies)]);
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