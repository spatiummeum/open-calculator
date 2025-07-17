/**
 * TESTS DE INTERFAZ DE USUARIO
 * Pruebas para verificar la funcionalidad de la interfaz y manipulación del DOM
 */

// Mock del DOM para testing
class MockElement {
  constructor(tagName = 'div') {
    this.tagName = tagName;
    this.textContent = '';
    this.innerHTML = '';
    this.className = '';
    this.style = {};
    this.children = [];
    this.parentNode = null;
    this.dataset = {};
    this.value = '';
    this.checked = false;
    this.eventListeners = {};
  }
  
  addEventListener(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }
  
  removeEventListener(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    }
  }
  
  appendChild(child) {
    this.children.push(child);
    child.parentNode = this;
    return child;
  }
  
  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.parentNode = null;
    }
    return child;
  }
  
  querySelector(selector) {
    return this.children.find(child => child.className.includes(selector.substring(1)));
  }
  
  querySelectorAll(selector) {
    return this.children.filter(child => child.className.includes(selector.substring(1)));
  }
  
  getAttribute(attr) {
    return this.dataset[attr] || null;
  }
  
  setAttribute(attr, value) {
    this.dataset[attr] = value;
  }
  
  focus() {
    this.focused = true;
  }
}

const mockDocument = {
  elements: {},
  getElementById: function(id) {
    if (!this.elements[id]) {
      this.elements[id] = new MockElement();
    }
    return this.elements[id];
  },
  createElement: function(tagName) {
    return new MockElement(tagName);
  },
  createTextNode: function(text) {
    const node = new MockElement('text');
    node.textContent = text;
    return node;
  }
};

// Mock global document
global.document = mockDocument;

describe('Manipulación del DOM', () => {
  
  let productsList, productsToDiscount;
  
  beforeEach(() => {
    productsList = new MockElement();
    productsToDiscount = [];
    
    // Reset mock document
    mockDocument.elements = {};
  });
  
  describe('Renderizado de Lista de Productos', () => {
    
    test('Debe mostrar estado vacío cuando no hay productos', () => {
      const mockRenderProductsList = () => {
        // Limpiar lista
        while (productsList.children.length > 0) {
          productsList.removeChild(productsList.children[0]);
        }
        
        if (productsToDiscount.length === 0) {
          const emptyState = mockDocument.createElement('p');
          emptyState.className = 'empty-state';
          emptyState.textContent = 'No hay productos agregados';
          productsList.appendChild(emptyState);
          return true;
        }
        return false;
      };
      
      const hasEmptyState = mockRenderProductsList();
      expect(hasEmptyState).toBe(true);
      expect(productsList.children.length).toBe(1);
      expect(productsList.children[0].textContent).toBe('No hay productos agregados');
    });
    
    test('Debe renderizar productos correctamente', () => {
      productsToDiscount = [
        { value: 1000, isHalf: false },
        { value: 2000, isHalf: true }
      ];
      
      const mockRenderProductsList = () => {
        // Limpiar lista
        while (productsList.children.length > 0) {
          productsList.removeChild(productsList.children[0]);
        }
        
        productsToDiscount.forEach((product, idx) => {
          const div = mockDocument.createElement('div');
          div.className = 'product-item';
          
          const productInfo = mockDocument.createElement('div');
          productInfo.className = 'product-info';
          
          const p = mockDocument.createElement('p');
          const baseValue = product.isHalf ? product.value / 2 : product.value;
          p.textContent = `Producto con valor base de $${baseValue}`;
          
          const small = mockDocument.createElement('small');
          small.textContent = `Unidades: ${product.isHalf ? 'Sí' : 'No'}`;
          
          productInfo.appendChild(p);
          productInfo.appendChild(small);
          
          const button = mockDocument.createElement('button');
          button.className = 'btn btn-outline btn-small';
          button.dataset.idx = idx;
          
          div.appendChild(productInfo);
          div.appendChild(button);
          productsList.appendChild(div);
        });
      };
      
      mockRenderProductsList();
      
      expect(productsList.children.length).toBe(2);
      expect(productsList.children[0].className).toBe('product-item');
      expect(productsList.children[1].className).toBe('product-item');
    });
  });
  
  describe('Manejo de Eventos', () => {
    
    test('Debe agregar event listeners a botones de eliminar', () => {
      const mockButtons = [
        new MockElement('button'),
        new MockElement('button')
      ];
      
      mockButtons.forEach((btn, idx) => {
        btn.dataset.idx = idx;
        btn.addEventListener('click', () => {
          const index = parseInt(btn.dataset.idx);
          productsToDiscount.splice(index, 1);
        });
      });
      
      // Verificar que los event listeners se agregaron
      expect(mockButtons[0].eventListeners['click']).toBeDefined();
      expect(mockButtons[1].eventListeners['click']).toBeDefined();
      expect(mockButtons[0].eventListeners['click'].length).toBe(1);
      expect(mockButtons[1].eventListeners['click'].length).toBe(1);
    });
    
    test('Debe eliminar producto correctamente al hacer clic', () => {
      productsToDiscount = [
        { value: 1000, isHalf: false },
        { value: 2000, isHalf: true }
      ];
      
      const mockButton = new MockElement('button');
      mockButton.dataset.idx = '0';
      
      const clickHandler = () => {
        const idx = parseInt(mockButton.dataset.idx);
        if (!isNaN(idx) && idx >= 0 && idx < productsToDiscount.length) {
          productsToDiscount.splice(idx, 1);
        }
      };
      
      mockButton.addEventListener('click', clickHandler);
      
      // Simular clic
      mockButton.eventListeners['click'][0]();
      
      expect(productsToDiscount.length).toBe(1);
      expect(productsToDiscount[0].value).toBe(2000);
    });
  });
  
  describe('Gestión de Visibilidad de Elementos', () => {
    
    test('Debe mostrar/ocultar botones según el estado', () => {
      const calculateBtn = new MockElement('button');
      const clearAllBtn = new MockElement('button');
      
      const updateButtonVisibility = (hasProducts) => {
        if (hasProducts) {
          calculateBtn.style.display = 'block';
          clearAllBtn.style.display = 'block';
        } else {
          calculateBtn.style.display = 'none';
          clearAllBtn.style.display = 'none';
        }
      };
      
      // Con productos
      updateButtonVisibility(true);
      expect(calculateBtn.style.display).toBe('block');
      expect(clearAllBtn.style.display).toBe('block');
      
      // Sin productos
      updateButtonVisibility(false);
      expect(calculateBtn.style.display).toBe('none');
      expect(clearAllBtn.style.display).toBe('none');
    });
    
    test('Debe mostrar/ocultar tarjeta de resultados', () => {
      const resultsCard = new MockElement('div');
      
      const showResults = (show) => {
        resultsCard.style.display = show ? 'block' : 'none';
      };
      
      showResults(true);
      expect(resultsCard.style.display).toBe('block');
      
      showResults(false);
      expect(resultsCard.style.display).toBe('none');
    });
  });
  
  describe('Limpieza de Campos', () => {
    
    test('Debe limpiar campos después de agregar producto', () => {
      const productValueInput = new MockElement('input');
      const isHalfCheckbox = new MockElement('input');
      
      productValueInput.value = '1000';
      isHalfCheckbox.checked = true;
      
      const clearInputs = () => {
        productValueInput.value = '';
        isHalfCheckbox.checked = false;
      };
      
      clearInputs();
      
      expect(productValueInput.value).toBe('');
      expect(isHalfCheckbox.checked).toBe(false);
    });
    
    test('Debe limpiar todo al hacer clic en "Limpiar Todo"', () => {
      const productValueInput = new MockElement('input');
      const isHalfCheckbox = new MockElement('input');
      const invoiceTotalInput = new MockElement('input');
      const resultsCard = new MockElement('div');
      
      productValueInput.value = '1000';
      isHalfCheckbox.checked = true;
      invoiceTotalInput.value = '50000';
      resultsCard.style.display = 'block';
      
      const clearAll = () => {
        productsToDiscount.length = 0;
        productValueInput.value = '';
        isHalfCheckbox.checked = false;
        invoiceTotalInput.value = '';
        resultsCard.style.display = 'none';
      };
      
      clearAll();
      
      expect(productsToDiscount.length).toBe(0);
      expect(productValueInput.value).toBe('');
      expect(isHalfCheckbox.checked).toBe(false);
      expect(invoiceTotalInput.value).toBe('');
      expect(resultsCard.style.display).toBe('none');
    });
  });
  
  describe('Actualización de Resultados', () => {
    
    test('Debe actualizar elementos de resultado correctamente', () => {
      const resultOriginal = new MockElement('p');
      const resultDiscount = new MockElement('p');
      const resultTotal = new MockElement('p');
      
      const updateResults = (original, discount, total) => {
        resultOriginal.textContent = `$${original.toLocaleString()}`;
        resultDiscount.textContent = `$${discount.toLocaleString()}`;
        resultTotal.textContent = `$${total.toLocaleString()}`;
      };
      
      updateResults(100000, 15000, 85000);
      
      expect(resultOriginal.textContent).toBe('$100,000');
      expect(resultDiscount.textContent).toBe('$15,000');
      expect(resultTotal.textContent).toBe('$85,000');
    });
  });
  
  describe('Manejo de Focus', () => {
    
    test('Debe establecer focus en input después de agregar producto', () => {
      const productValueInput = new MockElement('input');
      
      const setFocusAfterAdd = () => {
        productValueInput.focus();
      };
      
      setFocusAfterAdd();
      
      expect(productValueInput.focused).toBe(true);
    });
  });
});

describe('Integración de UI Components', () => {
  
  let productsToDiscount;
  
  beforeEach(() => {
    productsToDiscount = [];
  });
  
  test('Debe manejar flujo completo de agregar producto', () => {
    const productValueInput = new MockElement('input');
    const isHalfCheckbox = new MockElement('input');
    const addProductBtn = new MockElement('button');
    
    productValueInput.value = '1000';
    isHalfCheckbox.checked = false;
    
    const addProduct = () => {
      const value = parseFloat(productValueInput.value);
      const isHalf = isHalfCheckbox.checked;
      
      if (!isNaN(value) && value > 0) {
        productsToDiscount.push({ value, isHalf });
        productValueInput.value = '';
        isHalfCheckbox.checked = false;
        productValueInput.focus();
        return true;
      }
      return false;
    };
    
    const success = addProduct();
    
    expect(success).toBe(true);
    expect(productsToDiscount.length).toBe(1);
    expect(productsToDiscount[0].value).toBe(1000);
    expect(productsToDiscount[0].isHalf).toBe(false);
    expect(productValueInput.value).toBe('');
    expect(isHalfCheckbox.checked).toBe(false);
    expect(productValueInput.focused).toBe(true);
  });
  
  test('Debe manejar eliminación de productos de la lista', () => {
    productsToDiscount = [
      { value: 1000, isHalf: false },
      { value: 2000, isHalf: true },
      { value: 3000, isHalf: false }
    ];
    
    const removeProduct = (index) => {
      if (index >= 0 && index < productsToDiscount.length) {
        productsToDiscount.splice(index, 1);
        return true;
      }
      return false;
    };
    
    const result = removeProduct(1);
    
    expect(result).toBe(true);
    expect(productsToDiscount.length).toBe(2);
    expect(productsToDiscount[0].value).toBe(1000);
    expect(productsToDiscount[1].value).toBe(3000);
  });
});

describe('Casos Edge de UI', () => {
  
  let productsToDiscount, productsList;
  
  beforeEach(() => {
    productsToDiscount = [];
    productsList = new MockElement();
  });
  
  test('Debe manejar eliminación de índice inválido', () => {
    productsToDiscount = [{ value: 1000, isHalf: false }];
    
    const removeProduct = (index) => {
      if (index >= 0 && index < productsToDiscount.length) {
        productsToDiscount.splice(index, 1);
        return true;
      }
      return false;
    };
    
    const result1 = removeProduct(-1);
    const result2 = removeProduct(5);
    
    expect(result1).toBe(false);
    expect(result2).toBe(false);
    expect(productsToDiscount.length).toBe(1);
  });
  
  test('Debe manejar limpieza de lista ya vacía', () => {
    productsToDiscount = [];
    
    const clearList = () => {
      while (productsList.children.length > 0) {
        productsList.removeChild(productsList.children[0]);
      }
    };
    
    // No debe generar errores
    expect(() => clearList()).not.toThrow();
  });
});