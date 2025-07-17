/**
 * TESTS DE FORMATEO DE MONEDA
 * Pruebas para verificar el formateo correcto de moneda chilena (CLP)
 */

// Mock de Intl.NumberFormat para testing - disponible globalmente
const mockFormatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', { 
    style: 'currency', 
    currency: 'CLP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

describe('Formateo de Moneda Chilena (CLP)', () => {
  
  describe('Formateo Básico', () => {
    
    test('Debe formatear números enteros correctamente', () => {
      const testCases = [
        { input: 1000, expected: /^\$1\.000,00$/ },
        { input: 10000, expected: /^\$10\.000,00$/ },
        { input: 100000, expected: /^\$100\.000,00$/ },
        { input: 1000000, expected: /^\$1\.000\.000,00$/ }
      ];
      
      testCases.forEach(({ input, expected }) => {
        const result = mockFormatCurrency(input);
        expect(result).toMatch(expected);
      });
    });
    
    test('Debe formatear números decimales correctamente', () => {
      const testCases = [
        { input: 1000.50, expected: /^\$1\.000,50$/ },
        { input: 10000.25, expected: /^\$10\.000,25$/ },
        { input: 100000.99, expected: /^\$100\.000,99$/ },
        { input: 1000000.01, expected: /^\$1\.000\.000,01$/ }
      ];
      
      testCases.forEach(({ input, expected }) => {
        const result = mockFormatCurrency(input);
        expect(result).toMatch(expected);
      });
    });
    
    test('Debe formatear números muy pequeños', () => {
      const testCases = [
        { input: 0.01, expected: /^\$0,01$/ },
        { input: 0.50, expected: /^\$0,50$/ },
        { input: 1, expected: /^\$1,00$/ },
        { input: 10, expected: /^\$10,00$/ }
      ];
      
      testCases.forEach(({ input, expected }) => {
        const result = mockFormatCurrency(input);
        expect(result).toMatch(expected);
      });
    });
  });
  
  describe('Formateo de Números Grandes', () => {
    
    test('Debe formatear millones correctamente', () => {
      const testCases = [
        { input: 1000000, expected: /^\$1\.000\.000,00$/ },
        { input: 5000000, expected: /^\$5\.000\.000,00$/ },
        { input: 10000000, expected: /^\$10\.000\.000,00$/ },
        { input: 100000000, expected: /^\$100\.000\.000,00$/ }
      ];
      
      testCases.forEach(({ input, expected }) => {
        const result = mockFormatCurrency(input);
        expect(result).toMatch(expected);
      });
    });
    
    test('Debe formatear miles de millones correctamente', () => {
      const testCases = [
        { input: 1000000000, expected: /^\$1\.000\.000\.000,00$/ },
        { input: 5000000000, expected: /^\$5\.000\.000\.000,00$/ },
        { input: 10000000000, expected: /^\$10\.000\.000\.000,00$/ }
      ];
      
      testCases.forEach(({ input, expected }) => {
        const result = mockFormatCurrency(input);
        expect(result).toMatch(expected);
      });
    });
  });
  
  describe('Manejo de Decimales', () => {
    
    test('Debe redondear a 2 decimales', () => {
      const testCases = [
        { input: 1000.126, expected: /^\$1\.000,13$/ },
        { input: 1000.124, expected: /^\$1\.000,12$/ },
        { input: 1000.999, expected: /^\$1\.001,00$/ },
        { input: 1000.001, expected: /^\$1\.000,00$/ }
      ];
      
      testCases.forEach(({ input, expected }) => {
        const result = mockFormatCurrency(input);
        expect(result).toMatch(expected);
      });
    });
    
    test('Debe agregar .00 cuando no hay decimales', () => {
      const testCases = [1000, 5000, 10000, 100000];
      
      testCases.forEach(input => {
        const result = mockFormatCurrency(input);
        expect(result).toMatch(/,00$/);
      });
    });
    
    test('Debe manejar un solo decimal', () => {
      const testCases = [
        { input: 1000.1, expected: /^\$1\.000,10$/ },
        { input: 1000.5, expected: /^\$1\.000,50$/ },
        { input: 1000.9, expected: /^\$1\.000,90$/ }
      ];
      
      testCases.forEach(({ input, expected }) => {
        const result = mockFormatCurrency(input);
        expect(result).toMatch(expected);
      });
    });
  });
  
  describe('Casos Edge', () => {
    
    test('Debe manejar cero correctamente', () => {
      const result = mockFormatCurrency(0);
      expect(result).toMatch(/^\$0,00$/);
    });
    
    test('Debe manejar números negativos', () => {
      const testCases = [
        { input: -1000, expected: /^\$-1\.000,00$/ },
        { input: -10000.50, expected: /^\$-10\.000,50$/ }
      ];
      
      testCases.forEach(({ input, expected }) => {
        const result = mockFormatCurrency(input);
        expect(result).toMatch(expected);
      });
    });
    
    test('Debe manejar números muy precisos', () => {
      const testCases = [
        { input: 1000.33333333, expected: /^\$1\.000,33$/ },
        { input: 1000.66666666, expected: /^\$1\.000,67$/ },
        { input: 1000.99999999, expected: /^\$1\.001,00$/ }
      ];
      
      testCases.forEach(({ input, expected }) => {
        const result = mockFormatCurrency(input);
        expect(result).toMatch(expected);
      });
    });
  });
  
  describe('Consistencia de Formato', () => {
    
    test('Debe usar punto como separador de miles', () => {
      const result = mockFormatCurrency(1000000);
      expect(result).toMatch(/1\.000\.000/);
    });
    
    test('Debe usar coma como separador decimal', () => {
      const result = mockFormatCurrency(1000.50);
      expect(result).toMatch(/1\.000,50/);
    });
    
    test('Debe incluir símbolo de peso ($)', () => {
      const result = mockFormatCurrency(1000);
      expect(result).toMatch(/^\$/);
    });
    
    test('Debe mantener formato consistente para diferentes rangos', () => {
      const testCases = [
        1000.50,
        10000.50,
        100000.50,
        1000000.50
      ];
      
      testCases.forEach(input => {
        const result = mockFormatCurrency(input);
        expect(result).toMatch(/^\$[\d\.]+,50$/);
      });
    });
  });
  
  describe('Casos de Uso Específicos de la Aplicación', () => {
    
    test('Debe formatear correctamente resultados de descuentos', () => {
      // Valores típicos que se generan en la aplicación
      const testCases = [
        { input: 1190, expected: /^\$1\.190,00$/ },      // 1000 + 19% IVA
        { input: 2380, expected: /^\$2\.380,00$/ },      // 2000 + 19% IVA
        { input: 1190.595, expected: /^\$1\.190,60$/ },  // 1000.50 + 19% IVA
        { input: 5950, expected: /^\$5\.950,00$/ }       // Descuento total ejemplo
      ];
      
      testCases.forEach(({ input, expected }) => {
        const result = mockFormatCurrency(input);
        expect(result).toMatch(expected);
      });
    });
    
    test('Debe formatear valores de factura típicos', () => {
      const testCases = [
        { input: 50000, expected: /^\$50\.000,00$/ },
        { input: 100000, expected: /^\$100\.000,00$/ },
        { input: 500000, expected: /^\$500\.000,00$/ },
        { input: 1000000, expected: /^\$1\.000\.000,00$/ }
      ];
      
      testCases.forEach(({ input, expected }) => {
        const result = mockFormatCurrency(input);
        expect(result).toMatch(expected);
      });
    });
    
    test('Debe formatear valores de productos típicos', () => {
      const testCases = [
        { input: 1000, expected: /^\$1\.000,00$/ },
        { input: 2500.50, expected: /^\$2\.500,50$/ },
        { input: 5000, expected: /^\$5\.000,00$/ },
        { input: 10000.25, expected: /^\$10\.000,25$/ }
      ];
      
      testCases.forEach(({ input, expected }) => {
        const result = mockFormatCurrency(input);
        expect(result).toMatch(expected);
      });
    });
  });
  
  describe('Validación de Configuración', () => {
    
    test('Debe usar configuración correcta para es-CL', () => {
      const formatter = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      
      const options = formatter.resolvedOptions();
      expect(options.locale).toBe('es-CL');
      expect(options.currency).toBe('CLP');
      expect(options.minimumFractionDigits).toBe(2);
      expect(options.maximumFractionDigits).toBe(2);
    });
    
    test('Debe producir resultado consistente', () => {
      const value = 1000.50;
      const result1 = mockFormatCurrency(value);
      const result2 = mockFormatCurrency(value);
      
      expect(result1).toBe(result2);
    });
  });
  
  describe('Performance y Robustez', () => {
    
    test('Debe manejar múltiples llamadas sin problemas', () => {
      const values = [1000, 2000, 3000, 4000, 5000];
      
      const results = values.map(value => mockFormatCurrency(value));
      
      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(typeof result).toBe('string');
        expect(result).toMatch(/^\$/);
      });
    });
    
    test('Debe manejar valores extremos sin errores', () => {
      const extremeValues = [0.01, 999999999.99, 0, -1000];
      
      extremeValues.forEach(value => {
        expect(() => mockFormatCurrency(value)).not.toThrow();
      });
    });
  });
});

describe('Integración con Cálculos', () => {
  
  test('Debe formatear correctamente resultados de cálculos con IVA', () => {
    const IVA_RATE = 0.19;
    const product = { value: 1000, isHalf: false };
    
    const baseValue = product.isHalf ? product.value / 2 : product.value;
    const valueWithIva = baseValue * (1 + IVA_RATE);
    const formatted = mockFormatCurrency(valueWithIva);
    
    expect(formatted).toMatch(/^\$1\.190,00$/);
  });
  
  test('Debe formatear correctamente nuevos totales de factura', () => {
    const originalTotal = 100000;
    const discount = 5950;
    const newTotal = originalTotal - discount;
    const formatted = mockFormatCurrency(newTotal);
    
    expect(formatted).toMatch(/^\$94\.050,00$/);
  });
});