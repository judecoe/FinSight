/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    "no-unused-vars": "warn",
    "@next/next/no-img-element": "off",
  },
};
