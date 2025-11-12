/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: "node",
    testMatch: ["<rootDir>/__tests__/**/*.test.ts"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

    transform: {
        "^.+\\.(ts|tsx)$": [
            "@swc/jest",
            {
                jsc: {
                    target: "es2022",
                    parser: { syntax: "typescript", tsx: false },
                },
                module: { type: "commonjs" },
            },
        ],
    },

    moduleNameMapper: {
        "^@ai$": "<rootDir>/src/ai/index.ts",
        "^@ai/(.*)$": "<rootDir>/src/ai/$1",
        "^@db$": "<rootDir>/src/db/index.ts",
        "^@db/(.*)$": "<rootDir>/src/db/$1",
        "^@redis$": "<rootDir>/src/redis",
        "^@redis/(.*)$": "<rootDir>/src/redis/$1",
        "^@events$": "<rootDir>/src/events/index.ts",
        "^@events/(.*)$": "<rootDir>/src/events/$1",
        "^@routers$": "<rootDir>/src/routers/index.ts",
        "^@routers/(.*)$": "<rootDir>/src/routers/$1",
        "^@controllers$": "<rootDir>/src/controllers/index.ts",
        "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
        "^@logger$": "<rootDir>/src/logger/index.ts",
    },

    collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/__fixtures__/**"],
    clearMocks: true,
}
