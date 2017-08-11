module.exports = {
	"env": {
		"es6": true,
		"node": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"sourceType": "module"
	},
	"rules": {
		"comma-dangle": [
			"error",
			"always-multiline"
		],
		"eqeqeq": [
			"error",
		],
		"indent": [
			"error",
			"tab"
		],
		/*"linebreak-style": [
			"error",
			"unix"
		],*/
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"always"
		]
	}
};