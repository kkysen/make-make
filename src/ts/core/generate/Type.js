"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = {
    new(literal, hash, equals = (t1, t2) => `${hash(t1)} == ${hash(t2)}`) {
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
//# sourceMappingURL=Type.js.map