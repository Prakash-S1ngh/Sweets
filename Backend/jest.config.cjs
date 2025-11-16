module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.test.ts', '**/test/**/*.test.ts'],
  testTimeout: 20000,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
  ,
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts']
};
