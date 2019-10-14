module.exports = {
    "extends": "standard",
	"plugins": [
		"react"
	],
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		}
	},
	"rules": {
        "camelcase": "off",
		"eqeqeq": "off",
		"semi": "off",
		"curly": ["warn", "multi"],
		"react/jsx-uses-react": "error",
		"react/jsx-uses-vars": "error",
		"no-debugger": "warn"
    }
};