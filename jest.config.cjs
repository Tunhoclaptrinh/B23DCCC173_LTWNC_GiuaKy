module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
      },
    ],
  },
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/src/test/styleMock.cjs',
    '^@ant-design/colors/es/(.*)$': '@ant-design/colors/lib/$1',
  },
  clearMocks: true,
  collectCoverageFrom: [
    'src/api/**/*.ts',
    'src/features/books/booksSlice.ts',
    'src/features/books/selectors.ts',
    'src/features/books/search.ts',
    'src/features/books/components/BookCard.tsx',
    'src/app/middleware/*.ts',
    'src/hooks/*.ts',
  ],
  coverageThreshold: {
    global: { statements: 95, branches: 85, functions: 90, lines: 95 },
  },
};
