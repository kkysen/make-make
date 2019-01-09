export interface Type {
    readonly name: string;
    readonly isPointerType: boolean;
    readonly type: string;
    readonly constType: string;
    readonly hash: (t: string) => string;
    readonly equals: (t1: string, t2: string) => string;
}

export const Type = {
    
    new(literal: string,
        hash: (t: string) => string,
        equals: (t1: string, t2: string) => string = (t1, t2) => `${hash(t1)} == ${hash(t2)}`,
    ): Type {
        const [namePlusSpace, empty] = literal.split("*");
        const isPointerType = empty === "";
        const name = isPointerType ? namePlusSpace.trim() : `${namePlusSpace.trim()}Ptr`;
        const type = isPointerType ? `${name} *` : name;
        const constType = isPointerType ? `const ${type}` : type;
        return {
            name,
            isPointerType,
            type,
            constType,
            hash: t => `(${hash(`(${t})`)})`,
            equals: (t1, t2) => `(${equals(`${t1}`, `${t2}`)})`,
        };
        // surround funcs with parentheses like macros
    },
    
};