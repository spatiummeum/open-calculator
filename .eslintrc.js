module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    // Reglas de estilo
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'comma-dangle': ['error', 'never'],
    
    // Reglas de calidad
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'no-undef': 'error',
    'no-redeclare': 'error',
    'no-unreachable': 'error',
    
    // Reglas específicas para la aplicación
    'camelcase': 'error',
    'eqeqeq': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    
    // Reglas de espaciado
    'space-before-function-paren': ['error', 'never'],
    'space-in-parens': ['error', 'never'],
    'space-before-blocks': 'error',
    'keyword-spacing': 'error',
    
    // Reglas de organización
    'no-multiple-empty-lines': ['error', { max: 2 }],
    'eol-last': 'error',
    'no-trailing-spaces': 'error',
    
    // Reglas de funciones
    'prefer-arrow-callback': 'error',
    'arrow-spacing': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    
    // Reglas de objetos y arrays
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'comma-spacing': ['error', { before: false, after: true }],
    
    // Reglas de comentarios
    'spaced-comment': ['error', 'always'],
    
    // Reglas de testing removed - no eslint-plugin-jest installed
  },
  overrides: [
    {
      files: ['tests/**/*.js'],
      env: {
        jest: true
      },
      rules: {
        'no-console': 'off'
      }
    }
  ],
  globals: {
    // Variables globales de la aplicación
    'productsToDiscount': 'writable',
    'formatCurrency': 'readonly',
    'showError': 'readonly',
    'hideError': 'readonly',
    'renderProductsList': 'readonly',
    
    // Variables globales de testing
    'createMockElement': 'readonly',
    'createMockDocument': 'readonly'
  }
};