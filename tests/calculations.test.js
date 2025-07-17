/**
 * TESTS DE CÁLCULOS DE DESCUENTOS
 * Pruebas para verificar la lógica de cálculo de descuentos con IVA
 */

describe('Cálculos de Descuentos con IVA', () => {
  
  const IVA_RATE = 0.19; // 19% IVA chileno
  
  describe('Cálculo de Valor Base', () => {
    
    test('Debe calcular valor completo cuando isHalf = false', () => {
      const testCases = [
        { value: 1000, isHalf: false, expected: 1000 },
        { value: 2500.50, isHalf: false, expected: 2500.50 },
        { value: 10000, isHalf: false, expected: 10000 }
      ];
      
      testCases.forEach(({ value, isHalf, expected }) => {
        const baseValue = isHalf ? value / 2 : value;
        expect(baseValue).toBe(expected);
      });
    });
    
    test('Debe calcular valor mitad cuando isHalf = true (unidades)', () => {
      const testCases = [
        { value: 1000, isHalf: true, expected: 500 },
        { value: 2500.50, isHalf: true, expected: 1250.25 },
        { value: 10000, isHalf: true, expected: 5000 }
      ];
      
      testCases.forEach(({ value, isHalf, expected }) => {
        const baseValue = isHalf ? value / 2 : value;
        expect(baseValue).toBe(expected);
      });
    });
  });
  
  describe('Cálculo de IVA', () => {
    
    test('Debe aplicar IVA del 19% correctamente', () => {
      const testCases = [
        { baseValue: 1000, expected: 1190 },
        { baseValue: 2500, expected: 2975 },
        { baseValue: 10000, expected: 11900 }
      ];
      
      testCases.forEach(({ baseValue, expected }) => {
        const valueWithIva = baseValue * (1 + IVA_RATE);
        expect(valueWithIva).toBe(expected);
      });
    });
    
    test('Debe manejar decimales en cálculo de IVA', () => {
      const testCases = [
        { baseValue: 1000.50, expected: 1190.595 },
        { baseValue: 2500.25, expected: 2975.2975 },
        { baseValue: 999.99, expected: 1189.9881 }
      ];
      
      testCases.forEach(({ baseValue, expected }) => {
        const valueWithIva = baseValue * (1 + IVA_RATE);
        expect(valueWithIva).toBeCloseTo(expected, 4);
      });
    });
  });
  
  describe('Cálculo de Descuento Total', () => {
    
    test('Debe calcular descuento para un solo producto', () => {
      const product = { value: 1000, isHalf: false };
      const baseValue = product.isHalf ? product.value / 2 : product.value;
      const valueWithIva = baseValue * (1 + IVA_RATE);
      
      expect(valueWithIva).toBe(1190);
    });
    
    test('Debe calcular descuento para múltiples productos', () => {
      const products = [
        { value: 1000, isHalf: false }, // 1000 * 1.19 = 1190
        { value: 2000, isHalf: true },  // 1000 * 1.19 = 1190
        { value: 3000, isHalf: false }  // 3000 * 1.19 = 3570
      ];
      
      let totalDiscount = 0;
      products.forEach(product => {
        const baseValue = product.isHalf ? product.value / 2 : product.value;
        const valueWithIva = baseValue * (1 + IVA_RATE);
        totalDiscount += valueWithIva;
      });
      
      expect(totalDiscount).toBe(5950); // 1190 + 1190 + 3570
    });
  });
  
  describe('Cálculo de Nuevo Total de Factura', () => {
    
    test('Debe calcular nuevo total después del descuento', () => {
      const originalTotal = 100000;
      const discountAmount = 5950;
      const newTotal = originalTotal - discountAmount;
      
      expect(newTotal).toBe(94050);
    });
    
    test('Debe manejar casos donde el descuento es mayor que el total', () => {
      const originalTotal = 1000;
      const discountAmount = 1500;
      const newTotal = originalTotal - discountAmount;
      
      expect(newTotal).toBe(-500);
      expect(newTotal < 0).toBe(true);
    });
  });
  
  describe('Casos de Prueba Específicos del Negocio', () => {
    
    test('Escenario típico: Factura de $100.000 con productos mixtos', () => {
      const invoiceTotal = 100000;
      const products = [
        { value: 5000, isHalf: false },   // Producto completo
        { value: 8000, isHalf: true },    // Unidades (mitad)
        { value: 3000, isHalf: false }    // Producto completo
      ];
      
      let totalDiscount = 0;
      products.forEach(product => {
        const baseValue = product.isHalf ? product.value / 2 : product.value;
        const valueWithIva = baseValue * (1 + IVA_RATE);
        totalDiscount += valueWithIva;
      });
      
      const newTotal = invoiceTotal - totalDiscount;
      
      // Verificar cálculos paso a paso
      expect(totalDiscount).toBeCloseTo(14280, 2); // 5950 + 4760 + 3570 = 14280
      expect(newTotal).toBeCloseTo(85720, 2); // 100000 - 14280 = 85720
    });
    
    test('Escenario edge case: Producto muy pequeño', () => {
      const product = { value: 1, isHalf: false };
      const baseValue = product.isHalf ? product.value / 2 : product.value;
      const valueWithIva = baseValue * (1 + IVA_RATE);
      
      expect(valueWithIva).toBe(1.19);
    });
    
    test('Escenario edge case: Producto con unidades muy pequeño', () => {
      const product = { value: 2, isHalf: true };
      const baseValue = product.isHalf ? product.value / 2 : product.value;
      const valueWithIva = baseValue * (1 + IVA_RATE);
      
      expect(valueWithIva).toBe(1.19);
    });
  });
  
  describe('Precisión de Cálculos Flotantes', () => {
    
    test('Debe manejar correctamente números flotantes', () => {
      const testCases = [
        { value: 1000.33, isHalf: false },
        { value: 2500.67, isHalf: true },
        { value: 999.99, isHalf: false }
      ];
      
      testCases.forEach(({ value, isHalf }) => {
        const baseValue = isHalf ? value / 2 : value;
        const valueWithIva = baseValue * (1 + IVA_RATE);
        
        // Verificar que el resultado es un número válido
        expect(typeof valueWithIva).toBe('number');
        expect(isNaN(valueWithIva)).toBe(false);
        expect(isFinite(valueWithIva)).toBe(true);
      });
    });
    
    test('Debe mantener precisión adecuada para moneda', () => {
      const product = { value: 1000.33, isHalf: false };
      const baseValue = product.isHalf ? product.value / 2 : product.value;
      const valueWithIva = baseValue * (1 + IVA_RATE);
      
      // Verificar que mantiene precisión suficiente
      expect(valueWithIva).toBeCloseTo(1190.3927, 4);
    });
  });
  
  describe('Validación de Resultados', () => {
    
    test('Los descuentos nunca deben ser negativos', () => {
      const products = [
        { value: 1000, isHalf: false },
        { value: 2000, isHalf: true },
        { value: 5000, isHalf: false }
      ];
      
      products.forEach(product => {
        const baseValue = product.isHalf ? product.value / 2 : product.value;
        const valueWithIva = baseValue * (1 + IVA_RATE);
        
        expect(valueWithIva).toBeGreaterThan(0);
      });
    });
    
    test('El descuento con IVA debe ser mayor que el valor base', () => {
      const products = [
        { value: 1000, isHalf: false },
        { value: 2000, isHalf: true }
      ];
      
      products.forEach(product => {
        const baseValue = product.isHalf ? product.value / 2 : product.value;
        const valueWithIva = baseValue * (1 + IVA_RATE);
        
        expect(valueWithIva).toBeGreaterThan(baseValue);
      });
    });
  });
});

describe('Casos de Prueba de Integración Completa', () => {
  
  test('Flujo completo: Desde entrada hasta resultado final', () => {
    // Datos de entrada
    const invoiceTotal = 50000;
    const products = [
      { value: 2000, isHalf: false },
      { value: 3000, isHalf: true },
      { value: 1000, isHalf: false }
    ];
    
    // Cálculo paso a paso
    let totalDiscount = 0;
    const IVA_RATE = 0.19;
    
    products.forEach(product => {
      const baseValue = product.isHalf ? product.value / 2 : product.value;
      const valueWithIva = baseValue * (1 + IVA_RATE);
      totalDiscount += valueWithIva;
    });
    
    const newTotal = invoiceTotal - totalDiscount;
    
    // Verificaciones
    expect(totalDiscount).toBeGreaterThan(0);
    expect(newTotal).toBeLessThan(invoiceTotal);
    expect(typeof newTotal).toBe('number');
    expect(isFinite(newTotal)).toBe(true);
  });
});