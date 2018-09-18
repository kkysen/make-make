"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function asyncSpread(delegate) {
    const a = [];
    for await (const t of delegate) {
        a.push(t);
    }
    return a;
}
exports.asyncSpread = asyncSpread;
//# sourceMappingURL=asyncSpread.js.map