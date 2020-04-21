module.exports = {
    extends: ["prettier", "standard"],
	plugins: ["babel", "import", "react", "prettier"],
	parserOptions: {
		ecmaVersion: 6,
        sourceType: 'module',
		"ecmaFeatures": {
			"jsx": true
		}
	},
	parser: 'babel-eslint',
	rules: {
        "camelcase": "off",
		"eqeqeq": "off",
		"semi": "off",
		"curly": ["warn", "multi"],
		"react/jsx-uses-react": "error",
		"react/jsx-uses-vars": "error",
		"no-debugger": "warn",
		"no-unused-vars": "off",
		'arrow-parens': 'off', // Несовместимо с prettier
        'object-curly-newline': 'off', // Несовместимо с prettier
        'no-mixed-operators': 'off', // Несовместимо с prettier
        'arrow-body-style': 'off', // Это - не наш стиль?
        'function-paren-newline': 'off', // Несовместимо с prettier
		'space-before-function-paren': 0, // Несовместимо с prettier
		'prettier/prettier': 'warn'
	},
	env: {
        es6: true,
        browser: true,
        node: true,
    }
};