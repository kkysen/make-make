"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateHashMap(key, value) {
    const keyValueTypeName = `${key.name}_${value.name}`;
    const Node = `HashMapNode_${keyValueTypeName}`;
    const HashMap = `HashMap_${keyValueTypeName}`;
    const guardMacro = `${HashMap}_H`;
    const headerFileName = `${HashMap}.h`;
    const sourceFileName = `${HashMap}.c`;
    const K = key.type;
    const V = value.type;
    const KK = key.constType;
    const VV = value.constType;
    const header = `

/**
  * Adapted from java.util.HashMap in OpenJDK.
  *
  * Uses fibonacci hashing (https://probablydance.com/2018/06/16/fibonacci-hashing-the-optimization-that-the-world-forgot-or-a-better-alternative-to-integer-modulo/),
  * instead of the normal "hash & (table.length - 1)" the JDK uses.
  */

#ifndef ${guardMacro}
#define ${guardMacro}

#include <stdlib.h>
#include <stdbool.h>

struct ${Node};

typedef struct ${Node} ${Node};

struct ${Node} {
    ${K} key;
    ${V} value;
    u64 hash;
    ${Node} *next;
};

typedef struct ${HashMap} {
    ${Node} *table;
    size_t capacity;
    size_t size;
    size_t resizeThreshold;
    float loadFactor;
} ${HashMap};



void ${HashMap}_initWithCapacityAndLoadFactor(${HashMap} *this, size_t initialCapacity, float loadFactor);

void ${HashMap}_initWithCapacity(${HashMap} *this, size_t initialCapacity);

void ${HashMap}_initWithLoadFactor(${HashMap} *this, float loadFactor);

void ${HashMap}_init(${HashMap} *this);

void ${HashMap}_clear(${HashMap} *this);



${HashMap} *${HashMap}_newWithCapacityAndLoadFactor(size_t initialCapacity, float loadFactor);

${HashMap} *${HashMap}_newWithCapacity(size_t initialCapacity);

${HashMap} *${HashMap}_newWithLoadFactor(float loadFactor);

${HashMap} *${HashMap}_new();

void ${HashMap}_free(${HashMap} *this);



${V} ${HashMap}_get(const ${HashMap} *this, ${KK} key);

${V} ${HashMap}_getOrDefault(const ${HashMap} *this, ${KK} key, ${VV} defaultValue);



bool ${HashMap}_hasKey(const ${HashMap} *this, ${KK} key);

bool ${HashMap}_has(const ${HashMap} *this, ${KK} key, ${VV} value);

bool ${HashMap}_hasValue(  const ${HashMap} *this, ${VV} value);



${V} ${HashMap}_put(${HashMap} *this, ${KK} key, ${VV} value);

${V} ${HashMap}_putIfPresent(${HashMap} *this, ${KK} key, ${VV} value);

${V} ${HashMap}_putIfAbsent(${HashMap} *this, ${KK} key, ${VV} value);



${V} ${HashMap}_removeKey(${HashMap} *this, ${KK} key);

bool ${HashMap}_remove(${HashMap} *this, ${KK} key, ${VV} value);

bool ${HashMap}_removeValue(${HashMap} *this, ${VV} value);



${V} ${HashMap}_replace(${HashMap} *this, ${KK} key, ${VV} value);

${V} ${HashMap}_replaceIfEquals(${HashMap} *this, ${KK} key, ${VV} oldValue, ${VV} newValue);



void ${HashMap}_putAll(${HashMap} *this, const ${HashMap} *map);

${HashMap} *${HashMap}_copy(const ${HashMap} *this);



bool ${HashMap}_equals(const ${HashMap} *map1, const ${HashMap} *map2);


#endif // ${guardMacro}

    `;
    const forEach = (func, _this = "this", node = "node") => `for (size_t i = 0; i < ${_this}->capacity; i++) {
        for (const ${Node} *${node} = ${_this}->table + i; ${node}; ${node} = ${node}->next) {
            ${func}
        }
    }`;
    const source = `

#include "${headerFileName}"

#include <string.h>

static const size_t ${HashMap}_defaultInitialCapacity = 1u << 4u;

static const float ${HashMap}_defaultLoadFactor = 0.75f;



static size_t ${HashMap}_capacityFor(size_t size);

static size_t ${HashMap}_index(size_t hash);



static void ${HashMap}_resize(${HashMap} *this);

static ${V} ${HashMap}_putNode(${HashMap} *this, const ${Node} *node, bool onlyIfAbsent, bool evict);



static bool ${HashMap}_keyEquals(${KK} key1, ${KK} key2);

static bool ${HashMap}_valueEquals(${VV} value1, ${VV} value2);



static void ${Node}_clear(${Node} *this);

static bool ${Node}_keyEquals(const ${Node} *node1, const ${Node} *node2);



static bool ${HashMap}_keyEquals(${KK} const key1, ${KK} const key2) {
    return key1 == key2 || ${key.equals("key1", "key2")};
}

static bool ${HashMap}_valueEquals(${VV} const value1, ${VV} const value2) {
    return value1 == value2 || ${value.equals("value1", "value2")};
}



static void ${Node}_clear(${Node} *const this) {
    if (this->next) {
        ${Node}_clear(this->next);
    }
}

static bool ${Node}_keyEquals(const ${Node} *const node1, const ${Node} *const node2) {
    return node1->hash == node2->hash && ${HashMap}_keyEquals(node1->key, node2->key);
}



static size_t ${HashMap}_capacityFor(const size_t size) {
    const u8 leadingBitIndex = sizeof(size) * 8 - __builtin_clz(size);
    const size_t capacity = 1u << leadingBitIndex;
    return capacity == size ? capacity : capacity << 1u; // when size is a power of 2
}

#define FIBONACCI_FACTOR 11400714819323198485LLU // = (1u << 64) / phi

static size_t ${HashMap}_index(size_t hash) {
    const u8 shiftAmount = 0; // TODO
    hash ^= hash >> shiftAmount;
    return (11400714819323198485LLU * hash) >> shiftAmount;
}

#undef FIBONACCI_FACTOR



static void ${HashMap}_resize(${HashMap} *const this) {
    size_t oldCapacity = this->capacity;
    // size_t newCapacity = 0;
    if (oldCapacity > 0) {
        // newCapacity = oldCapacity << 1u;
        return;
    }
}



// node is meant to be stack allocated
static ${V} ${HashMap}_putNode(${HashMap} *const this, const ${Node} *const node, const bool onlyIfAbsent, const bool evict) {
    if (!this->table || this->capacity == 0) {
        ${HashMap}_resize(this);
    }
    const size_t i = (this->capacity - 1) & node->hash;
    ${Node} *const head = this->table + i;
    if (!head) {
        memcpy(head, node, sizeof(*node));
    } else {
        return NULL;
        ${Node} *e;
        if (${Node}_keyEquals(node, head)) {
            e = head;
        } else {
            for (${Node} *e = head->next; e; e = e->next) {
            
            }
            for (;;) {
                if (!(e = head->next)) {
                    head->next = malloc(sizeof(*node));
                    memcpy(head->next, node, sizeof(*node));
                    break;
                }
                if (${Node}_keyEquals(node, e)) {
                    break;
                }
                // head = e;
            }
        }
    }
    
    if (++this->size > this->resizeThreshold) {
        ${HashMap}_resize(this);
    }
    return NULL;
}



void ${HashMap}_initWithCapacityAndLoadFactor(${HashMap} *const this, const size_t initialCapacity, const float loadFactor) {
    this->size = 0;
    this->capacity = 0;
    this->loadFactor = loadFactor;
    this->resizeThreshold = ${HashMap}_capacityFor(initialCapacity);
    this->table = NULL;
}

void ${HashMap}_initWithCapacity(${HashMap} *const this, const size_t initialCapacity) {
    ${HashMap}_initWithCapacityAndLoadFactor(this, initialCapacity, ${HashMap}_defaultLoadFactor);
}

void ${HashMap}_initWithLoadFactor(${HashMap} *const this, const float loadFactor) {
    ${HashMap}_initWithCapacityAndLoadFactor(this, ${HashMap}_defaultInitialCapacity, loadFactor);
}

void ${HashMap}_init(${HashMap} *const this) {
    ${HashMap}_initWithCapacity(this, ${HashMap}_defaultInitialCapacity);
}

void ${HashMap}_clear(${HashMap} *const this) {
    for (size_t i = 0; i < this->capacity; i++) {
        ${Node}_clear(this->table + i);
    }
    
    free(this->table);
    this->table = NULL;
    this->size = 0;
    this->resizeThreshold = 0; // TODO check
    this->loadFactor = 0; // TODO check
}



${HashMap} *${HashMap}_newWithCapacityAndLoadFactor(const size_t initialCapacity, const float loadFactor) {
    ${HashMap} *const this = malloc(sizeof(*this));
    ${HashMap}_initWithCapacityAndLoadFactor(this, initialCapacity, loadFactor);
    return this;
}

${HashMap} *${HashMap}_newWithCapacity(const size_t initialCapacity) {
    return ${HashMap}_newWithCapacityAndLoadFactor(initialCapacity, ${HashMap}_defaultLoadFactor);
}

${HashMap} *${HashMap}_newWithLoadFactor(const float loadFactor) {
    return ${HashMap}_newWithCapacityAndLoadFactor(${HashMap}_defaultInitialCapacity, loadFactor);
}

${HashMap} *${HashMap}_new() {
    return ${HashMap}_newWithCapacity(${HashMap}_defaultInitialCapacity);
}

void ${HashMap}_free(${HashMap} *const this) {
    if (this) {
        ${HashMap}_clear(this);
        free(this);
    }
}



${V} ${HashMap}_get(const ${HashMap} *const this, ${KK} const key) {
    return NULL;
}

${V} ${HashMap}_getOrDefault(const ${HashMap} *const this, ${KK} const key, ${VV} const defaultValue) {
    return NULL;
}



bool ${HashMap}_hasKey(const ${HashMap} *const this, ${KK} const key) {
    return false;
}

bool ${HashMap}_has(const ${HashMap} *const this, ${KK} const key, ${VV} const value) {
    return false;
}

bool ${HashMap}_hasValue(const ${HashMap} *const this, ${VV} const value) {
    return false;
}



${V} ${HashMap}_put(${HashMap} *const this, ${KK} const key, ${VV} const value) {
    return NULL;
}

${V} ${HashMap}_putIfPresent(${HashMap} *const this, ${KK} const key, ${VV} const value) {
    return NULL;
}

${V} ${HashMap}_putIfAbsent(${HashMap} *const this, ${KK} const key, ${VV} const value) {
    return NULL;
}



${V} ${HashMap}_removeKey(${HashMap} *const this, ${KK} const key) {
    return NULL;
}

bool ${HashMap}_remove(${HashMap} *const this, ${KK} const key, ${VV} const value) {
    return false;
}

bool ${HashMap}_removeValue(${HashMap} *const this, ${VV} const value) {
    return false;
}



${V} ${HashMap}_replace(${HashMap} *const this, ${KK} const key, ${VV} const value) {
    return NULL;
}

${V} ${HashMap}_replaceIfEquals(${HashMap} *const this, ${KK} const key, ${VV} const oldValue, ${VV} const newValue) {
    return NULL;
}



void ${HashMap}_putAll(${HashMap} *const this, const ${HashMap} *const map) {
    ${forEach(`${HashMap}_putNode(this, node, false, true);`, "map")}
}

${HashMap} *${HashMap}_copy(const ${HashMap} *const this) {
    ${HashMap} *copy = ${HashMap}_newWithCapacityAndLoadFactor(this->capacity, this->loadFactor);
    ${HashMap}_putAll(copy, this);
    return copy;
}



bool ${HashMap}_equals(const ${HashMap} *const map1, const ${HashMap} *const map2) {
    ${forEach(`if (!${HashMap}_has(map2, node->key, node->value)) {
                return false;
            }`, "map1")}
    return true;
}

    `;
    return async (dir) => {
        await Promise.all([
            dir.fileToCreate(headerFileName, header),
            dir.fileToCreate(sourceFileName, source),
        ].map(e => e.create()));
    };
}
exports.generateHashMap = generateHashMap;
//# sourceMappingURL=generateHashMap.js.map