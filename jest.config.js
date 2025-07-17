module.exports = {
  // Entorno de pruebas
  testEnvironment: 'jsdom',
  
  // Archivos de configuración
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Patrones de archivos de prueba
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  
  // Archivos a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/'
  ],
  
  // Configuración de cobertura
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/**/*.min.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  
  // Directorio de cobertura
  coverageDirectory: 'coverage',
  
  // Reportes de cobertura
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html',
    'json'
  ],
  
  // Umbrales de cobertura
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    },
    './js/main.js': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Transformaciones
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Extensiones de archivo
  moduleFileExtensions: [
    'js',
    'json'
  ],
  
  // Configuración de mocks
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/js/$1'
  },
  
  // Configuración de timeout
  testTimeout: 10000,
  
  // Configuración de ejecución
  verbose: true,
  
  // Configuración de cache
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
  
  // Configuración de notificaciones
  notify: false,
  
  // Configuración de paralelización
  maxWorkers: '50%',
  
  // Configuración de limpieza
  clearMocks: true,
  restoreMocks: true,
  
  // Configuración de errores
  errorOnDeprecated: true,
  
  // Configuración de reportes
  reporters: [
    'default'
  ]
};