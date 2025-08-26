import type { Config } from 'jest';
import { createDefaultEsmPreset } from 'ts-jest'

const config: Config = {
  ...createDefaultEsmPreset(),
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  extensionsToTreatAsEsm: ['.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }]
  },
  // Maps js files to ts. This keeps the imports as ".js", but they get translated into ".ts" during testing
  moduleNameMapper: {
    '^src/(.*)\\.js$': '<rootDir>/src/$1.ts', 
    '^\\./(client|proto/messages)\\.js$': '<rootDir>/src/lib/$1.ts', 
  },
};

export default config;