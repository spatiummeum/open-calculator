
// =========================
// VARIABLES Y ELEMENTOS DEL DOM
// =========================
// Array para almacenar los productos a descontar
// Cada producto es un objeto: { value: número, isHalf: booleano }
const productsToDiscount = [];

// Helper function to safely get DOM elements
const safeGetElement = (id) => {
  if (typeof document !== 'undefined' && document.getElementById) {
    return document.getElementById(id);
  }
  return null;
};

const invoiceTotalInput = safeGetElement('invoice-total');
const productValueInput = safeGetElement('product-value');
const isHalfCheckbox = safeGetElement('is-half');
const addProductBtn = safeGetElement('add-product-btn');
const calculateBtn = safeGetElement('calculate-btn');
const productsList = safeGetElement('products-list');
const resultsCard = safeGetElement('results-card');
const clearAllBtn = safeGetElement('clear-all-btn');

// =========================
// UTILIDAD: Formatear moneda CLP
// =========================
// Formatea un número como moneda chilena (pesos) con 2 decimales
// Ejemplo: 10000.50 -> "$10.000,50"
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// =========================
// MANEJO DE ERRORES
// =========================
// Referencias a elementos DOM para mostrar mensajes de error
const errorAlertElement = safeGetElement('error-alert');
const errorMessageElement = safeGetElement('error-message');

// Muestra un mensaje de error en la interfaz
// @param {string} message - Mensaje de error a mostrar
const showError = (message) => {
  if (errorMessageElement) {
    errorMessageElement.textContent = message;
  }
  if (errorAlertElement) {
    errorAlertElement.style.display = 'block';
  }
};

// Oculta el mensaje de error
const hideError = () => {
  if (errorAlertElement) {
    errorAlertElement.style.display = 'none';
  }
};

// =========================
// RENDERIZAR LISTA DE PRODUCTOS
// =========================
// Actualiza la interfaz mostrando la lista de productos agregados
// Si no hay productos, muestra un estado vacío
function renderProductsList() {
  // Return early if not in browser environment
  if (!productsList || typeof document === 'undefined') {
    return;
  }

  // Limpiar lista de manera segura
  while (productsList.firstChild) {
    productsList.removeChild(productsList.firstChild);
  }

  if (productsToDiscount.length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No hay productos agregados';
    productsList.appendChild(emptyState);
    if (calculateBtn) calculateBtn.style.display = 'none';
    if (clearAllBtn) clearAllBtn.style.display = 'none';
    return;
  }

  productsToDiscount.forEach((product, idx) => {
    const div = document.createElement('div');
    div.className = 'product-item';

    const productInfo = document.createElement('div');
    productInfo.className = 'product-info';

    const p = document.createElement('p');
    const strong = document.createElement('strong');
    // Usar valor float directamente
    const baseValue = product.isHalf ? product.value / 2 : product.value;
    strong.textContent = formatCurrency(baseValue);

    p.appendChild(document.createTextNode('Producto con valor base de '));
    p.appendChild(strong);

    const small = document.createElement('small');
    small.textContent = `Unidades: ${product.isHalf ? 'Sí' : 'No'}`;

    productInfo.appendChild(p);
    productInfo.appendChild(small);

    const button = document.createElement('button');
    button.className = 'btn btn-outline btn-small';
    button.dataset.idx = idx;
    button.title = 'Eliminar';

    // Crear ícono de eliminación de manera segura
    const icon = document.createElement('span');
    icon.textContent = '✕'; // Uso de entidad segura
    button.appendChild(icon);

    div.appendChild(productInfo);
    div.appendChild(button);
    productsList.appendChild(div);
  });

  // Mostrar botones cuando hay productos
  if (calculateBtn) calculateBtn.style.display = 'block';
  if (clearAllBtn) clearAllBtn.style.display = 'block';

  // Asignar eventos a los botones de eliminar
  if (productsList.querySelectorAll) {
    productsList.querySelectorAll('button[data-idx]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        if (!isNaN(idx) && idx >= 0 && idx < productsToDiscount.length) {
          productsToDiscount.splice(idx, 1);
          renderProductsList();
          if (resultsCard) resultsCard.style.display = 'none';
        }
      });
    });
  }
}

// =========================
// EVENTO: Agregar producto
// =========================
// Maneja el clic en el botón "Agregar producto":
// 1. Valida que el valor ingresado sea válido (>0)
// 2. Agrega el producto al array productsToDiscount
// 3. Actualiza la lista de productos
// 4. Limpia los campos de entrada
if (addProductBtn) {
  addProductBtn.addEventListener('click', () => {
    const value = parseFloat(productValueInput?.value);
    const isHalf = isHalfCheckbox?.checked;

    // Validación mejorada - valores numéricos y límites
    if (isNaN(value) || value <= 0 || value > 1000000000) {
      showError('Por favor, ingrese un valor de producto válido entre 1 y 1.000.000.000.');
      return;
    }

    // Validar que el valor no contenga más de 2 decimales
    if ((value.toString().split('.')[1] || []).length > 2) {
      showError('Por favor, ingrese un valor con máximo 2 decimales.');
      return;
    }

    // Guardamos el producto en nuestro array
    productsToDiscount.push({ value, isHalf });
    renderProductsList();
    // Limpiamos los inputs y ocultamos errores
    if (productValueInput) productValueInput.value = '';
    if (isHalfCheckbox) isHalfCheckbox.checked = false;
    if (productValueInput) productValueInput.focus();
    hideError();
  });
}

// =========================
// EVENTO: Limpiar todo
// =========================
// Resetea toda la aplicación:
// 1. Vacía la lista de productos
// 2. Limpia todos los campos de entrada
// 3. Oculta los resultados
if (clearAllBtn) {
  clearAllBtn.addEventListener('click', () => {
    productsToDiscount.length = 0;
    renderProductsList();
    if (resultsCard) resultsCard.style.display = 'none';
    if (productValueInput) productValueInput.value = '';
    if (isHalfCheckbox) isHalfCheckbox.checked = false;
    if (invoiceTotalInput) invoiceTotalInput.value = '';
  });
}

// =========================
// EVENTO: Calcular descuento final
// =========================
// Realiza el cálculo completo de descuentos:
// 1. Valida el monto total de la factura
// 2. Calcula el descuento para cada producto (considerando IVA)
// 3. Actualiza la interfaz con los resultados
if (calculateBtn) {
  calculateBtn.addEventListener('click', () => {
    const originalInvoiceTotal = parseFloat(invoiceTotalInput?.value);

    // Validación mejorada para el total de la factura
    if (isNaN(originalInvoiceTotal) || originalInvoiceTotal <= 0 || originalInvoiceTotal > 10000000000) {
      showError('Por favor, ingrese un monto de factura válido entre 1 y 10.000.000.000.');
      return;
    }

    // Validar decimales
    if ((originalInvoiceTotal.toString().split('.')[1] || []).length > 2) {
      showError('El monto de la factura debe tener máximo 2 decimales.');
      return;
    }

    if (productsToDiscount.length === 0) {
      showError('Por favor, añada al menos un producto para descontar.');
      return;
    }

    hideError();

    let totalDiscountAmount = 0;
    const IVA_RATE = 0.19; // Tasa de IVA (19%)

    // Cálculo de descuento manteniendo precisión float
    productsToDiscount.forEach(product => {
      // 1. Determinar valor base: completo o mitad (para unidades)
      const baseValueToDiscount = product.isHalf ? product.value / 2 : product.value;

      // 2. Calcular valor con IVA: base * (1 + IVA_RATE)
      const valueWithIva = baseValueToDiscount * (1 + IVA_RATE);

      // 3. Acumular al descuento total manteniendo float
      totalDiscountAmount += valueWithIva;
    });

    // 4. Calcular el nuevo total con float
    const newInvoiceTotal = originalInvoiceTotal - totalDiscountAmount;

    // Mostramos los resultados
    const resultOriginal = safeGetElement('result-original');
    const resultDiscount = safeGetElement('result-discount');
    const resultTotal = safeGetElement('result-total');

    if (resultOriginal) resultOriginal.textContent = formatCurrency(originalInvoiceTotal);
    if (resultDiscount) resultDiscount.textContent = formatCurrency(totalDiscountAmount);
    if (resultTotal) resultTotal.textContent = formatCurrency(newInvoiceTotal);

    if (resultsCard) resultsCard.style.display = 'block';
  });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatCurrency,
    showError,
    hideError,
    renderProductsList,
    productsToDiscount,
    safeGetElement
  };
}
