export async function asyncSpread<T>(delegate: AsyncIterable<T>): Promise<T[]> {
    const a: T[] = [];
    for await (const t of delegate) {
        a.push(t);
    }
    return a;
}