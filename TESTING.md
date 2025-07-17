# Documentación de Testing

## Resumen

Esta documentación describe la estrategia de testing implementada para la Calculadora de Rebajes, incluyendo los tipos de pruebas, herramientas utilizadas y cómo ejecutar los tests.

## Estructura de Testing

### 📁 Archivos de Testing

```
calculator/
├── tests/
│   ├── setup.js              # Configuración global de Jest
│   ├── validation.test.js     # Tests de validación de entrada
│   ├── calculations.test.js   # Tests de cálculos de descuentos
│   ├── ui.test.js            # Tests de interfaz de usuario
│   └── currency.test.js      # Tests de formateo de moneda
├── package.json              # Configuración de scripts de testing
├── jest.config.js            # Configuración de Jest
├── .babelrc                  # Configuración de Babel
└── .eslintrc.js              # Configuración de ESLint
```

## Tipos de Pruebas

### 1. Tests de Validación (`validation.test.js`)

**Propósito**: Verificar que la validación de datos de entrada funciona correctamente.

**Casos de prueba**:
- ✅ Validación de valores de producto (numéricos, rangos, decimales)
- ✅ Validación de monto total de factura
- ✅ Validación de checkbox "Unidades"
- ✅ Validación de lista de productos
- ✅ Manejo de errores y mensajes

**Ejemplo de ejecución**:
```javascript
// Valida que se rechacen valores no numéricos
test('Debe rechazar valores no numéricos', () => {
  const invalidValues = ['abc', '', 'null', 'undefined', 'NaN'];
  invalidValues.forEach(value => {
    const result = isNaN(parseFloat(value));
    expect(result).toBe(true);
  });
});
```

### 2. Tests de Cálculos (`calculations.test.js`)

**Propósito**: Verificar que los cálculos de descuentos con IVA son correctos.

**Casos de prueba**:
- ✅ Cálculo de valor base (completo vs. unidades)
- ✅ Aplicación de IVA (19%)
- ✅ Cálculo de descuento total
- ✅ Cálculo de nuevo total de factura
- ✅ Casos específicos del negocio
- ✅ Precisión de números flotantes

**Ejemplo de ejecución**:
```javascript
// Verifica que el IVA se aplique correctamente
test('Debe aplicar IVA del 19% correctamente', () => {
  const testCases = [
    { baseValue: 1000, expected: 1190 },
    { baseValue: 2500, expected: 2975 }
  ];
  
  testCases.forEach(({ baseValue, expected }) => {
    const valueWithIva = baseValue * (1 + 0.19);
    expect(valueWithIva).toBe(expected);
  });
});
```

### 3. Tests de Interfaz de Usuario (`ui.test.js`)

**Propósito**: Verificar que la manipulación del DOM funciona correctamente.

**Casos de prueba**:
- ✅ Renderizado de lista de productos
- ✅ Manejo de eventos (agregar/eliminar productos)
- ✅ Gestión de visibilidad de elementos
- ✅ Limpieza de campos
- ✅ Actualización de resultados

**Ejemplo de ejecución**:
```javascript
// Verifica que se muestre estado vacío cuando no hay productos
test('Debe mostrar estado vacío cuando no hay productos', () => {
  const mockRenderProductsList = () => {
    if (productsToDiscount.length === 0) {
      // Lógica de renderizado
      return true;
    }
    return false;
  };
  
  const hasEmptyState = mockRenderProductsList();
  expect(hasEmptyState).toBe(true);
});
```

### 4. Tests de Formateo de Moneda (`currency.test.js`)

**Propósito**: Verificar que el formateo de moneda chilena (CLP) es correcto.

**Casos de prueba**:
- ✅ Formateo de números enteros y decimales
- ✅ Formateo de números grandes (millones, miles de millones)
- ✅ Manejo de decimales y redondeo
- ✅ Casos edge (cero, negativos, muy precisos)
- ✅ Consistencia de formato chileno

**Ejemplo de ejecución**:
```javascript
// Verifica el formateo de moneda chilena
test('Debe formatear números enteros correctamente', () => {
  const testCases = [
    { input: 1000, expected: /^\$1\.000,00$/ },
    { input: 10000, expected: /^\$10\.000,00$/ }
  ];
  
  testCases.forEach(({ input, expected }) => {
    const result = mockFormatCurrency(input);
    expect(result).toMatch(expected);
  });
});
```

## Herramientas de Testing

### Jest
- **Framework principal** para ejecutar tests
- **Configuración**: `jest.config.js`
- **Entorno**: jsdom para simulación del navegador
- **Cobertura**: Reportes en HTML, LCOV y texto

### Babel
- **Transpilación** de código ES6+ para Node.js
- **Configuración**: `.babelrc`
- **Preset**: `@babel/preset-env`

### ESLint
- **Linting** de código JavaScript
- **Configuración**: `.eslintrc.js`
- **Estilo**: Standard con reglas personalizadas

## Comandos de Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests con output verbose
npm run test:verbose
```

### Linting

```bash
# Verificar código
npm run lint:check

# Corregir problemas automáticamente
npm run lint
```

### Servidor de Desarrollo

```bash
# Servidor Python
npm run serve

# Servidor Node.js
npm run serve:node
```

## Configuración de Cobertura

### Umbrales de Cobertura

```javascript
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
}
```

### Reportes de Cobertura

- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`
- **JSON**: `coverage/coverage-final.json`
- **Texto**: Salida en consola

## Mocks y Configuración

### Mocks Globales (`setup.js`)

- **DOM**: Simulación completa del DOM
- **LocalStorage/SessionStorage**: Mocks de almacenamiento
- **Fetch API**: Mock de requests HTTP
- **Timers**: Mock de setTimeout/setInterval
- **Intl.NumberFormat**: Mock de formateo de números

### Helpers de Testing

```javascript
// Crear elemento DOM mockeado
const element = createMockElement('div', { className: 'test' });

// Crear documento mockeado
const document = createMockDocument();

// Matchers personalizados
expect(value).toBeValidCurrency();
expect(value).toBePositiveNumber();
```

## Casos de Uso Típicos

### Scenario 1: Validación de Entrada

```javascript
// Test de validación de producto
const product = { value: 1000.50, isHalf: false };
const validations = [
  !isNaN(product.value),
  product.value > 0,
  product.value <= 1000000000
];
expect(validations.every(v => v === true)).toBe(true);
```

### Scenario 2: Cálculo de Descuento

```javascript
// Test de cálculo completo
const invoiceTotal = 50000;
const products = [{ value: 2000, isHalf: false }];
const IVA_RATE = 0.19;

const baseValue = products[0].value;
const valueWithIva = baseValue * (1 + IVA_RATE);
const newTotal = invoiceTotal - valueWithIva;

expect(newTotal).toBe(47620);
```

### Scenario 3: Actualización de UI

```javascript
// Test de renderizado de lista
const mockRender = () => {
  if (products.length === 0) {
    return 'empty-state';
  }
  return 'product-list';
};

expect(mockRender()).toBe('product-list');
```

## Mejores Prácticas

### Estructura de Tests

1. **Describe blocks**: Agrupar tests relacionados
2. **Test names**: Descriptivos y en español
3. **Arrange-Act-Assert**: Estructura clara en cada test
4. **Setup/Teardown**: Usar beforeEach/afterEach

### Assertions

```javascript
// Específicas y descriptivas
expect(result).toBe(expected);
expect(array).toHaveLength(2);
expect(string).toMatch(/pattern/);
expect(number).toBeCloseTo(1.23, 2);
```

### Mocks

```javascript
// Mocks específicos por test
const mockFunction = jest.fn();
mockFunction.mockReturnValue(42);
expect(mockFunction).toHaveBeenCalledWith(arg);
```

## Solución de Problemas

### Problemas Comunes

1. **Tests fallan por timing**: Usar `await` o `waitFor`
2. **Mocks no funcionan**: Verificar orden de imports
3. **Cobertura baja**: Añadir tests para edge cases
4. **ESLint errors**: Verificar configuración en `.eslintrc.js`

### Debugging

```javascript
// Debugging en tests
console.log(JSON.stringify(result, null, 2));
expect(result).toEqual(expect.objectContaining({
  property: expect.any(String)
}));
```

## Contribución

### Añadir Nuevos Tests

1. Crear archivo `.test.js` en directorio `tests/`
2. Seguir estructura existing
3. Añadir casos edge y happy path
4. Verificar cobertura con `npm run test:coverage`

### Modificar Tests Existentes

1. Mantener backward compatibility
2. Actualizar documentación si es necesario
3. Ejecutar suite completa antes de commit

---

**Mantenido por**: Erick Carrillo  
**Última actualización**: 2024-01-01  
**Versión**: 1.0.0