# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **discount calculator web application** for Chilean invoices with VAT (19%). It's a static frontend-only application built with vanilla HTML, CSS, and JavaScript, designed for Nestlé Chile's Pre-sales team.

## Development Environment

### Running the Application
- **Development server**: Simply open `index.html` in a web browser
- **No build process**: This is a static web application with no compilation step
- **No package manager**: Uses vanilla JavaScript, HTML, and CSS only

### Testing
- **No automated tests**: The application relies on manual testing
- **Manual testing reference**: Check the README.md for testing guidelines

## Code Architecture

### Core Structure
- **Single Page Application**: All functionality contained in one HTML file
- **Event-driven architecture**: Uses DOM event listeners for user interactions
- **State management**: Simple global array (`productsToDiscount`) for product data
- **Modular CSS**: Organized in logical sections with clear comments

### Key Components

#### Main Application Logic (`js/main.js`)
- **Product management**: Add, display, and remove products from discount list
- **Discount calculation**: Calculates VAT-inclusive discounts (19% Chilean VAT)
- **Currency formatting**: Chilean peso (CLP) formatting with proper localization
- **Input validation**: Numeric validation with decimal precision limits
- **Error handling**: User-friendly error messages with `showError()` function

#### Styling (`css/style.css`)
- **Glassmorphism design**: Modern translucent cards with backdrop-filter effects
- **Responsive layout**: CSS Grid for main layout, flex for components
- **Component-based CSS**: Organized sections for cards, buttons, forms, results
- **Chilean branding**: Nestlé and Savory logos with proper styling

#### HTML Structure (`index.html`)
- **Semantic markup**: Proper use of headings, labels, and ARIA attributes
- **Responsive design**: Mobile-first approach with viewport meta tag
- **Embedded SVG icons**: Inline SVG for better performance and styling control

### Key Business Logic

#### Discount Calculation Formula
```javascript
// 1. Determine base value (full product value or half for "unidades")
let baseValue = product.isHalf ? product.value / 2 : product.value;

// 2. Add 19% Chilean VAT
let valueWithIva = baseValue * (1 + 0.19);

// 3. Subtract from original invoice total
let newTotal = originalInvoice - totalDiscountAmount;
```

#### Input Validation Rules
- **Numeric values only**: Using `parseFloat()` with NaN checks
- **Decimal precision**: Maximum 2 decimal places for currency values
- **Value limits**: Product values 1-1,000,000,000, invoice totals 1-10,000,000,000

### UI/UX Patterns
- **Progressive disclosure**: Results section hidden until calculation
- **Immediate feedback**: Real-time validation and error messages
- **Accessibility**: Proper labels, semantic HTML, keyboard navigation
- **Loading states**: Button state changes during interactions

## File Organization

```
calculator/
├── index.html          # Main application file
├── css/
│   ├── style.css       # Main styles (glassmorphism, responsive)
│   └── fonts.css       # Montserrat font loading
├── js/
│   └── main.js         # All application logic
├── fonts/              # Montserrat font files
├── icons/              # SVG icons and logos
└── README.md           # Project documentation
```

## Common Development Patterns

### Event Handler Structure
```javascript
// Pattern: Validate -> Process -> Update UI -> Handle Errors
buttonElement.addEventListener('click', () => {
    // 1. Validate input
    if (validation fails) {
        showError('message');
        return;
    }
    
    // 2. Process data
    // 3. Update UI
    // 4. Clear errors
    hideError();
});
```

### DOM Manipulation Safety
- Uses `while (element.firstChild)` for safe element clearing
- Creates elements with `document.createElement()` instead of innerHTML
- Proper event delegation for dynamically created elements

### Currency Formatting
- Uses `Intl.NumberFormat` for proper Chilean peso formatting
- Consistent 2-decimal precision across all monetary displays
- Proper locale setting ('es-CL') for Chilean number formatting

## Security Considerations

- **Input sanitization**: All user input validated before processing
- **XSS prevention**: No innerHTML usage, manual DOM element creation
- **Safe DOM manipulation**: Proper element creation and event handling
- **No external dependencies**: Reduces attack surface area

## Performance Notes

- **Inline SVG**: Icons embedded for faster loading
- **Minimal JavaScript**: Single file with clear, documented functions
- **Efficient DOM updates**: Targeted updates instead of full re-renders
- **Local font loading**: Fonts served locally to avoid external requests