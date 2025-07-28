import typescriptEslint from '@typescript-eslint/eslint-plugin';
import security from 'eslint-plugin-security';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: typescriptParser,
            ecmaVersion: 2022,
            sourceType: 'module',
            parserOptions: {
                project: [
                    './tsconfig.json',
                    './api-gateway/tsconfig.json',
                    './shared/tsconfig.json',
                    './post-service/tsconfig.json',
                    './user-service/tsconfig.json',
                    './scripts/tsconfig.json'
                ]
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                exports: 'writable',
                module: 'writable',
                require: 'readonly',
                global: 'readonly'
            }
        },
        plugins: {
            '@typescript-eslint': typescriptEslint,
            'security': security
        },
        rules: {
            // ESLint recommended rules
            'no-unused-vars': 'off', // Turned off in favor of @typescript-eslint/no-unused-vars
            
            // TypeScript ESLint rules
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    'argsIgnorePattern': '^_'
                }
            ],
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unsafe-assignment': 'error',
            '@typescript-eslint/no-unsafe-call': 'error',
            '@typescript-eslint/no-unsafe-member-access': 'error',
            '@typescript-eslint/no-unsafe-return': 'error',
            '@typescript-eslint/prefer-nullish-coalescing': 'error',
            '@typescript-eslint/prefer-optional-chain': 'error',
            '@typescript-eslint/strict-boolean-expressions': 'error',
            '@typescript-eslint/prefer-readonly': 'error',
            '@typescript-eslint/require-array-sort-compare': 'error',
            
            // General rules
            'no-console': [
                'warn',
                {
                    'allow': [
                        'warn',
                        'error'
                    ]
                }
            ],
            'no-debugger': 'error',
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',
            'no-script-url': 'error',
            'no-void': 'error',
            'no-with': 'error',
            'prefer-const': 'error',
            'prefer-template': 'error',
            'require-await': 'error',
            
            // Security rules
            'security/detect-object-injection': 'warn',
            'security/detect-non-literal-regexp': 'warn',
            'security/detect-unsafe-regex': 'error',
            'security/detect-buffer-noassert': 'error',
            'security/detect-child-process': 'warn',
            'security/detect-disable-mustache-escape': 'error',
            'security/detect-eval-with-expression': 'error',
            'security/detect-no-csrf-before-method-override': 'error',
            'security/detect-non-literal-fs-filename': 'warn',
            'security/detect-non-literal-require': 'warn',
            'security/detect-possible-timing-attacks': 'warn',
            'security/detect-pseudoRandomBytes': 'error'
        }
    },
    // Configuration for test files
    {
        files: [
            '**/*.test.ts',
            '**/*.spec.ts',
            '**/__tests__/**/*.ts'
        ],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            'security/detect-object-injection': 'off'
        }
    },
    // Configuration for migration files
    {
        files: ['**/migrations/**/*.js'],
        rules: {
            '@typescript-eslint/no-var-requires': 'off',
            'security/detect-object-injection': 'off'
        }
    },
    // Ignore patterns
    {
        ignores: [
            'dist/',
            'node_modules/',
            'coverage/',
            '*.js',
            'shared/middleware/validation.d.ts'
        ]
    }
];