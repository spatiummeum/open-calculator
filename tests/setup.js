/**
 * CONFIGURACIÓN DE TESTING
 * Configuración global para Jest y mocks necesarios
 */

// Configuración global de Jest
global.console = {
  ...console,
  // Silenciar logs durante testing
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock de sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.sessionStorage = sessionStorageMock;

// Mock de window.location
delete window.location;
window.location = {
  href: 'http://localhost:8000',
  origin: 'http://localhost:8000',
  protocol: 'http:',
  host: 'localhost:8000',
  hostname: 'localhost',
  port: '8000',
  pathname: '/',
  search: '',
  hash: '',
  reload: jest.fn(),
  replace: jest.fn(),
  assign: jest.fn()
};

// Mock de window.alert, confirm, prompt
global.alert = jest.fn();
global.confirm = jest.fn();
global.prompt = jest.fn();

// Mock de setTimeout y setInterval
global.setTimeout = jest.fn((callback, delay) => {
  return global.setTimeout(callback, delay);
});
global.setInterval = jest.fn((callback, delay) => {
  return global.setInterval(callback, delay);
});
global.clearTimeout = jest.fn();
global.clearInterval = jest.fn();

// Mock de fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0))
  })
);

// Mock de ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock de IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock de MutationObserver
global.MutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn()
}));

// Mock de matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

// Mock de getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: jest.fn().mockImplementation(() => ({
    getPropertyValue: jest.fn().mockReturnValue('')
  }))
});

// Mock de scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn()
});

// Mock de requestAnimationFrame
global.requestAnimationFrame = jest.fn(callback => {
  return setTimeout(callback, 0);
});

global.cancelAnimationFrame = jest.fn(id => {
  clearTimeout(id);
});

// Mock de crypto para IDs únicos
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'mock-uuid-1234-5678-9012'),
    getRandomValues: jest.fn((array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    })
  }
});

// Mock de Intl.NumberFormat
global.Intl = {
  ...global.Intl,
  NumberFormat: jest.fn().mockImplementation((locale, options) => {
    return {
      format: (number) => {
        if (locale === 'es-CL' && options?.style === 'currency') {
          return `$${number.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        return number.toString();
      },
      resolvedOptions: () => ({
        locale: locale || 'es-CL',
        currency: options?.currency || 'CLP',
        style: options?.style || 'currency',
        minimumFractionDigits: options?.minimumFractionDigits || 2,
        maximumFractionDigits: options?.maximumFractionDigits || 2
      })
    };
  })
};

// Mock de Date para tests consistentes
const mockDate = new Date('2024-01-01T00:00:00.000Z');
global.Date = jest.fn(() => mockDate);
Object.assign(global.Date, {
  now: jest.fn(() => mockDate.getTime()),
  parse: jest.fn(Date.parse),
  UTC: jest.fn(Date.UTC)
});

// Mock de performance
global.performance = {
  now: jest.fn(() => 123456.789),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn()
};

// Helper para crear elementos DOM mockeados
global.createMockElement = (tagName = 'div', properties = {}) => {
  const element = {
    tagName: tagName.toUpperCase(),
    textContent: '',
    innerHTML: '',
    className: '',
    style: {},
    children: [],
    parentNode: null,
    dataset: {},
    value: '',
    checked: false,
    disabled: false,
    hidden: false,
    eventListeners: {},
    ...properties
  };
  
  element.addEventListener = jest.fn((event, callback) => {
    if (!element.eventListeners[event]) {
      element.eventListeners[event] = [];
    }
    element.eventListeners[event].push(callback);
  });
  
  element.removeEventListener = jest.fn((event, callback) => {
    if (element.eventListeners[event]) {
      element.eventListeners[event] = element.eventListeners[event].filter(cb => cb !== callback);
    }
  });
  
  element.appendChild = jest.fn((child) => {
    element.children.push(child);
    child.parentNode = element;
    return child;
  });
  
  element.removeChild = jest.fn((child) => {
    const index = element.children.indexOf(child);
    if (index > -1) {
      element.children.splice(index, 1);
      child.parentNode = null;
    }
    return child;
  });
  
  element.querySelector = jest.fn((selector) => {
    return element.children.find(child => child.className?.includes(selector.substring(1)));
  });
  
  element.querySelectorAll = jest.fn((selector) => {
    return element.children.filter(child => child.className?.includes(selector.substring(1)));
  });
  
  element.getAttribute = jest.fn((attr) => {
    return element.dataset[attr] || null;
  });
  
  element.setAttribute = jest.fn((attr, value) => {
    element.dataset[attr] = value;
  });
  
  element.focus = jest.fn(() => {
    element.focused = true;
  });
  
  element.blur = jest.fn(() => {
    element.focused = false;
  });
  
  element.click = jest.fn(() => {
    if (element.eventListeners.click) {
      element.eventListeners.click.forEach(callback => callback());
    }
  });
  
  return element;
};

// Helper para crear mock de document
global.createMockDocument = () => {
  const elements = {};
  
  return {
    elements,
    getElementById: jest.fn((id) => {
      if (!elements[id]) {
        elements[id] = createMockElement();
      }
      return elements[id];
    }),
    createElement: jest.fn((tagName) => {
      return createMockElement(tagName);
    }),
    createTextNode: jest.fn((text) => {
      const node = createMockElement('text');
      node.textContent = text;
      return node;
    }),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  };
};

// Configuración de matchers personalizados
expect.extend({
  toBeValidCurrency(received) {
    const pass = /^\$[\d.,]+$/.test(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be valid currency format`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be valid currency format`,
        pass: false
      };
    }
  },
  
  toBePositiveNumber(received) {
    const pass = typeof received === 'number' && received > 0 && isFinite(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a positive number`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be a positive number`,
        pass: false
      };
    }
  }
});

// Configuración de timeout para tests
jest.setTimeout(10000);

// Configuración para después de cada test
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});