module.exports = {
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": [
    "@typescript-eslint",
    "prettier",
  ],
  "overrides": [],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "prettier/prettier": "error",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "import/extensions": [
      "off",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
    "import/no-unresolved": "off",
    "max-classes-per-file": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "import/no-extraneous-dependencies": ["error", { "devDependencies": ["**/jest.config.ts", "**/*.spec.ts"] }],
    "no-underscore-dangle": "off",
    "import/order": ["error", {
      "groups": ["builtin", "internal", "external", "parent", "sibling", "index"],
      "pathGroups": [
        {
          "pattern": "@/**",
          "group": "internal",
          "position": "before"
        }
      ]
    }],
    "class-methods-use-this": "off",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "no-useless-constructor": "off",
    "no-console": "off"
  },
  "settings": {
    "import/resolver": {
      "typescript": {},
    }
  }
}
