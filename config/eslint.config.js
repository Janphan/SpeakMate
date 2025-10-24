const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const reactNative = require('eslint-plugin-react-native');
const security = require('eslint-plugin-security');

module.exports = [
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx}'],
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-native': reactNative,
            security,
        },
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                global: 'readonly',
                module: 'readonly',
                require: 'readonly',
                exports: 'readonly',
                fetch: 'readonly',
                FormData: 'readonly',
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
            'security/detect-object-injection': 'error',
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
            'security/detect-pseudoRandomBytes': 'error',
            'react/prop-types': 'warn',
            'react/no-unused-prop-types': 'warn',
            'react/no-array-index-key': 'error',
            'react/no-unstable-nested-components': 'error',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react-native/no-unused-styles': 'error',
            'react-native/no-inline-styles': 'warn',
            'react-native/no-color-literals': 'warn',
            complexity: ['warn', 15],
            'max-lines-per-function': ['warn', 150],
            'no-console': 'warn',
            'no-unused-vars': 'error',
            'prefer-const': 'error',
        },
    },
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
            '.expo/**',
            '.git/**',
            'coverage/**',
            '*.log',
            '.env*',
            'android/**',
            'ios/**',
            'web-build/**',
            'babel.config.js',
            'metro.config.js',
        ],
    },
];