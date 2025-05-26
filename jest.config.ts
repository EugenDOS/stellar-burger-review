/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/src'],

  // The test regex pattern Jest uses to detect test files
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',

  // An array of file extensions Jest should look for
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Module path aliases
  moduleNameMapper: {
    '^@ui$': '<rootDir>/src/components/ui',
    '^@store$': '<rootDir>/src/services/store',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@components$': '<rootDir>/src/components',
    '^@pages$': '<rootDir>/src/pages'
  },
};

export default config;
