
// =========================
// VARIABLES Y ELEMENTOS DEL DOM
// =========================
let productsToDiscount = [];
const invoiceTotalInput = document.getElementById('invoice-total');
const productValueInput = document.getElementById('product-value');
const isHalfCheckbox = document.getElementById('is-half');
const addProductBtn = document.getElementById('add-product-btn');
const calculateBtn = document.getElementById('calculate-btn');
const productsList = document.getElementById('products-list');
const resultsCard = document.getElementById('results-card');
const clearAllBtn = document.getElementById('clear-all-btn');

// =========================
// UTILIDAD: Formatear moneda CLP
// =========================
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
};

// =========================
// RENDERIZAR LISTA DE PRODUCTOS
// =========================
function renderProductsList() {
    productsList.innerHTML = '';
    if (productsToDiscount.length === 0) {
        productsList.innerHTML = '<p class="empty-state">No hay productos agregados</p>';
        calculateBtn.style.display = 'none';
        clearAllBtn.style.display = 'none';
        return;
    }
    productsToDiscount.forEach((product, idx) => {
        const div = document.createElement('div');
        div.className = 'product-item';
        const effectiveValue = product.isHalf ? product.value / 2 : product.value;
        div.innerHTML = `<div class="product-info"><p>Producto con valor base de <strong>${formatCurrency(effectiveValue)}</strong></p><small>Unidades: ${product.isHalf ? 'Sí' : 'No'}</small></div>` +
            `<button class='btn btn-outline btn-small' data-idx='${idx}' title='Eliminar'>&#10006;</button>`;
        productsList.appendChild(div);
    });
    calculateBtn.style.display = 'block';
    clearAllBtn.style.display = 'block';
    // Asignar eventos a los botones de eliminar
    productsList.querySelectorAll('button[data-idx]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.getAttribute('data-idx'));
            productsToDiscount.splice(idx, 1);
            renderProductsList();
            resultsCard.style.display = 'none';
        });
    });
}

// =========================
// EVENTO: Agregar producto
// =========================
addProductBtn.addEventListener('click', () => {
    const value = parseFloat(productValueInput.value);
    const isHalf = isHalfCheckbox.checked;

    if (isNaN(value) || value <= 0) {
        alert('Por favor, ingrese un valor de producto válido.');
        return;
    }

    // Guardamos el producto en nuestro array
    productsToDiscount.push({ value, isHalf });
    renderProductsList();
    // Limpiamos los inputs
    productValueInput.value = '';
    isHalfCheckbox.checked = false;
    productValueInput.focus();
});

// =========================
// EVENTO: Limpiar todo
// =========================
clearAllBtn.addEventListener('click', () => {
    productsToDiscount.length = 0;
    renderProductsList();
    resultsCard.style.display = 'none';
    productValueInput.value = '';
    isHalfCheckbox.checked = false;
    invoiceTotalInput.value = '';
});

// =========================
// EVENTO: Calcular descuento final
// =========================
calculateBtn.addEventListener('click', () => {
    const originalInvoiceTotal = parseFloat(invoiceTotalInput.value);

    if (isNaN(originalInvoiceTotal) || originalInvoiceTotal <= 0) {
        alert('Por favor, ingrese el monto original de la factura.');
        return;
    }

    if (productsToDiscount.length === 0) {
        alert('Por favor, añada al menos un producto para descontar.');
        return;
    }

    let totalDiscountAmount = 0;
    const IVA_RATE = 0.19; // 19%

    // Iteramos sobre cada producto para calcular el descuento
    productsToDiscount.forEach(product => {
        // 1. Determinar el valor base del descuento (completo o mitad)
        let baseValueToDiscount = product.isHalf ? product.value / 2 : product.value;
        // 2. Sumarle el 19% de IVA a ese valor
        let valueWithIva = baseValueToDiscount * (1 + IVA_RATE);
        // 3. Acumularlo en el descuento total
        totalDiscountAmount += valueWithIva;
    });

    // 4. Calcular el nuevo total
    const newInvoiceTotal = originalInvoiceTotal - totalDiscountAmount;

    // Mostramos los resultados
    document.getElementById('result-original').textContent = formatCurrency(originalInvoiceTotal);
    // Usamos Math.round para evitar problemas con decimales en el descuento total
    document.getElementById('result-discount').textContent = formatCurrency(Math.round(totalDiscountAmount));
    document.getElementById('result-total').textContent = formatCurrency(Math.round(newInvoiceTotal));
    
    resultsCard.style.display = 'block';
});