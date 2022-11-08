const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  preset: 'ts-jest',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src',
  }),
};
