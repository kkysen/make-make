import {Dir} from "../../util/io/Dir";
import {Type} from "./Type";


export function generateArrayList(e: Type): (dir: Dir) => Promise<void> {
    const ArrayList = `ArrayList_${e.name}`;
    const guardMacro = `${ArrayList}_H`;
    
    const headerFileName = `${ArrayList}.h`;
    const sourceFileName = `${ArrayList}.c`;
    
    const E = e.type;
    const EE = e.constType;
    
    const header = `

/**
  * Adapted from java.util.ArrayList in OpenJDK.
  */

#ifndef ${guardMacro}
#define ${guardMacro}

#include <stdlib.h>
#include <stdbool.h>

typedef struct ${ArrayList} {
    ${E} *elements;
    size_t capacity;
    size_t size;
} ${ArrayList};



void ${ArrayList}_initWithCapacity(${ArrayList} *this, size_t initialCapacity);

void ${ArrayList}_initWithArray(${ArrayList} *this, ${EE} *array, size_t arraySize);

#define ${ArrayList}_initWithArrayLiteral(this, array) ${ArrayList}_ofArray(this, array, arrayLen(array));

void ${ArrayList}_initWithArrayList(${ArrayList} *this, const ${ArrayList} *list);

void ${ArrayList}_init(${ArrayList} *this);

void ${ArrayList}_clear(${ArrayList} *this);



${ArrayList} *${ArrayList}_newWithCapacity(size_t initialCapacity);

${ArrayList} *${ArrayList}_ofArray(${EE} *array, size_t arraySize);

#define ${ArrayList}_ofArrayLiteral(array) ${ArrayList}_ofArray(array, arrayLen(array));

${ArrayList} *${ArrayList}_ofArrayList(const ${ArrayList} *list);

${ArrayList} *${ArrayList}_new();

void ${ArrayList}_free(${ArrayList} *this);



${EE} *${ArrayList}_constArray(const ${ArrayList} *this);

${E} *${ArrayList}_array(${ArrayList} *this);

bool ${ArrayList}_isEmpty(const ${ArrayList} *this);



void ${ArrayList}_add(${ArrayList} *this, ${E} e);

void ${ArrayList}_insert(${ArrayList} *this, size_t i, ${E} e);



${E} ${ArrayList}_get(const ${ArrayList} *this, size_t i);

${E} ${ArrayList}_first(const ${ArrayList} *this);

${E} ${ArrayList}_last(const ${ArrayList} *this);



${E} ${ArrayList}_set(${ArrayList} *this, size_t i, ${E} i);



ssize_t ${ArrayList}_indexOfInRange(const ${ArrayList} *this, ${EE} e, size_t begin, size_t end);

ssize_t ${ArrayList}_lastIndexOfInRange(const ${ArrayList} *this, ${EE} e, size_t begin, size_t end);

ssize_t ${ArrayList}_indexOf(const ${ArrayList} *this, ${EE} e);

ssize_t ${ArrayList}_lastIndexOf(const ${ArrayList} *this, ${EE} e);



bool ${ArrayList}_hasInRange(const ${ArrayList} *this, ${EE} e);

bool ${ArrayList}_has(const ${ArrayList} *this, ${EE} e);



${E} ${ArrayList}_removeIndex(${ArrayList} *this, size_t i);

bool ${ArrayList}_remove(${ArrayList} *this, ${EE} e);



void ${ArrayList}_insertArray(${ArrayList} *this, size_t i, ${EE} *array, size_t arraySize);

#define ${ArrayList}_insertArrayLiteral(this, i, array) ${ArrayList}_insertArray(this, i, array, arrayLen(array));

void ${ArrayList}_insertArrayList(${ArrayList} *this, size_t i, ${ArrayList} *list);



void ${ArrayList}_addArray(${ArrayList} *this, ${EE} *array, size_t arraySize);

#define ${ArrayList}_addArrayLiteral(this, array) ${ArrayList}_addArray(this, array, arrayLen(array));

void ${ArrayList}_addArrayList(${ArrayList} *this, ${ArrayList} *list);



void ${ArrayList}_removeRange(${ArrayList} *this, size_t begin, size_t end);

void ${ArrayList}_shrinkToSize(${ArrayList} *this);

void ${ArrayList}_ensureCapacity(${ArrayList} *this, size_t capacity);

void ${ArrayList}_ensureMoreCapacity(${ArrayList} *this, size_t moreCapacity);



${ArrayList} *${ArrayList}_subList(const ${ArrayList} *this, size_t begin, size_t end);

${ArrayList} *${ArrayList}_copy(const ${ArrayList} *this);



bool ${ArrayList}_equals(const ${ArrayList} *list1, const ${ArrayList} *list2);



#endif // ${guardMacro}

    `;
    
    const forEach = (func: string, _this: string = "this", node: string = "node") =>
        `for (size_t i = 0; i < ${_this}->capacity; i++) {
        for (const ${Node} *${node} = ${_this}->table + i; ${node}; ${node} = ${node}->next) {
            ${func}
        }
    }`;
    
    const source = `

#include "${headerFileName}"

#include <string.h>

static const size_t ${ArrayList}_defaultInitialCapacity = 10;

static bool ${ArrayList}_elementEquals(${EE} e1, ${EE} e2);



static bool ${ArrayList}_elementEquals(${EE} const e1, ${EE} const e1) {
    return e1 == e2 || ${e.equals("e1", "e1")};
}



void ${ArrayList}_initWithCapacityAndLoadFactor(${ArrayList} *const this, const size_t initialCapacity, const float loadFactor) {
    this->size = 0;
    this->capacity = 0;
    this->loadFactor = loadFactor;
    this->resizeThreshold = ${ArrayList}_capacityFor(initialCapacity);
    this->table = NULL;
}

void ${ArrayList}_initWithCapacity(${ArrayList} *const this, const size_t initialCapacity) {
    ${ArrayList}_initWithCapacityAndLoadFactor(this, initialCapacity, ${ArrayList}_defaultLoadFactor);
}

void ${ArrayList}_initWithLoadFactor(${ArrayList} *const this, const float loadFactor) {
    ${ArrayList}_initWithCapacityAndLoadFactor(this, ${ArrayList}_defaultInitialCapacity, loadFactor);
}

void ${ArrayList}_init(${ArrayList} *const this) {
    ${ArrayList}_initWithCapacity(this, ${ArrayList}_defaultInitialCapacity);
}

void ${ArrayList}_clear(${ArrayList} *const this) {
    for (size_t i = 0; i < this->capacity; i++) {
        ${Node}_clear(this->table + i);
    }
    
    free(this->table);
    this->table = NULL;
    this->size = 0;
    this->resizeThreshold = 0; // TODO check
    this->loadFactor = 0; // TODO check
}



${ArrayList} *${ArrayList}_newWithCapacityAndLoadFactor(const size_t initialCapacity, const float loadFactor) {
    ${ArrayList} *const this = malloc(sizeof(*this));
    ${ArrayList}_initWithCapacityAndLoadFactor(this, initialCapacity, loadFactor);
    return this;
}

${ArrayList} *${ArrayList}_newWithCapacity(const size_t initialCapacity) {
    return ${ArrayList}_newWithCapacityAndLoadFactor(initialCapacity, ${ArrayList}_defaultLoadFactor);
}

${ArrayList} *${ArrayList}_newWithLoadFactor(const float loadFactor) {
    return ${ArrayList}_newWithCapacityAndLoadFactor(${ArrayList}_defaultInitialCapacity, loadFactor);
}

${ArrayList} *${ArrayList}_new() {
    return ${ArrayList}_newWithCapacity(${ArrayList}_defaultInitialCapacity);
}

void ${ArrayList}_free(${ArrayList} *const this) {
    if (this) {
        ${ArrayList}_clear(this);
        free(this);
    }
}



${V} ${ArrayList}_get(const ${ArrayList} *const this, ${KK} const key) {
    return NULL;
}

${V} ${ArrayList}_getOrDefault(const ${ArrayList} *const this, ${KK} const key, ${VV} const defaultValue) {
    return NULL;
}



bool ${ArrayList}_hasKey(const ${ArrayList} *const this, ${KK} const key) {
    return false;
}

bool ${ArrayList}_has(const ${ArrayList} *const this, ${KK} const key, ${VV} const value) {
    return false;
}

bool ${ArrayList}_hasValue(const ${ArrayList} *const this, ${VV} const value) {
    return false;
}



${V} ${ArrayList}_put(${ArrayList} *const this, ${KK} const key, ${VV} const value) {
    return NULL;
}

${V} ${ArrayList}_putIfPresent(${ArrayList} *const this, ${KK} const key, ${VV} const value) {
    return NULL;
}

${V} ${ArrayList}_putIfAbsent(${ArrayList} *const this, ${KK} const key, ${VV} const value) {
    return NULL;
}



${V} ${ArrayList}_removeKey(${ArrayList} *const this, ${KK} const key) {
    return NULL;
}

bool ${ArrayList}_remove(${ArrayList} *const this, ${KK} const key, ${VV} const value) {
    return false;
}

bool ${ArrayList}_removeValue(${ArrayList} *const this, ${VV} const value) {
    return false;
}



${V} ${ArrayList}_replace(${ArrayList} *const this, ${KK} const key, ${VV} const value) {
    return NULL;
}

${V} ${ArrayList}_replaceIfEquals(${ArrayList} *const this, ${KK} const key, ${VV} const oldValue, ${VV} const newValue) {
    return NULL;
}



void ${ArrayList}_putAll(${ArrayList} *const this, const ${ArrayList} *const map) {
    ${forEach(`${ArrayList}_putNode(this, node, false, true);`, "map")}
}

${ArrayList} *${ArrayList}_copy(const ${ArrayList} *const this) {
    ${ArrayList} *copy = ${ArrayList}_newWithCapacityAndLoadFactor(this->capacity, this->loadFactor);
    ${ArrayList}_putAll(copy, this);
    return copy;
}



bool ${ArrayList}_equals(const ${ArrayList} *const map1, const ${ArrayList} *const map2) {
    ${forEach(`if (!${ArrayList}_has(map2, node->key, node->value)) {
                return false;
            }`, "map1")}
    return true;
}

    `;
    
    return async dir => {
        await Promise.all([
            dir.fileToCreate(headerFileName, header),
            dir.fileToCreate(sourceFileName, source),
        ].map(e => e.create()));
    };
}