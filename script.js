// ========================================
// LABORATORIO DE MECÁNICA DE SUELOS
// Sistema de Cotización - JavaScript
// ========================================

// === NAVEGACIÓN MÓVIL ===
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

mobileToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// === ANIMACIONES AL SCROLL ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card').forEach((card) => {
    observer.observe(card);
});

// === SISTEMA DE COTIZACIÓN ===

// Función para agregar una nueva fila a la tabla
function addRow() {
    const tableBody = document.getElementById('quoteTableBody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td><input type="text" class="item-description" placeholder="Ej: Análisis granulométrico"></td>
        <td><input type="number" class="item-quantity" value="1" min="1"></td>
        <td><input type="number" class="item-price" placeholder="0" min="0"></td>
        <td class="item-subtotal">$0</td>
        <td><button class="btn-remove" onclick="removeRow(this)">×</button></td>
    `;

    tableBody.appendChild(newRow);
    attachRowListeners(newRow);
}

// Función para eliminar una fila
function removeRow(button) {
    const row = button.closest('tr');
    const tableBody = document.getElementById('quoteTableBody');

    // No permitir eliminar si solo queda una fila
    if (tableBody.children.length > 1) {
        row.remove();
        calculateTotals();
    } else {
        alert('Debe haber al menos un servicio en la cotización');
    }
}

// Función para adjuntar listeners a una fila
function attachRowListeners(row) {
    const quantityInput = row.querySelector('.item-quantity');
    const priceInput = row.querySelector('.item-price');

    quantityInput?.addEventListener('input', () => {
        updateRowSubtotal(row);
        calculateTotals();
    });

    priceInput?.addEventListener('input', () => {
        updateRowSubtotal(row);
        calculateTotals();
    });
}

// Función para actualizar el subtotal de una fila
function updateRowSubtotal(row) {
    const quantity = parseFloat(row.querySelector('.item-quantity')?.value) || 0;
    const price = parseFloat(row.querySelector('.item-price')?.value) || 0;
    const subtotal = quantity * price;

    const subtotalCell = row.querySelector('.item-subtotal');
    if (subtotalCell) {
        subtotalCell.textContent = formatCurrency(subtotal);
    }
}

// Función para calcular totales
function calculateTotals() {
    const rows = document.querySelectorAll('#quoteTableBody tr');
    let subtotal = 0;

    rows.forEach(row => {
        const quantity = parseFloat(row.querySelector('.item-quantity')?.value) || 0;
        const price = parseFloat(row.querySelector('.item-price')?.value) || 0;
        subtotal += quantity * price;
    });

    // IGV 18% (Perú)
    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    document.getElementById('subtotal').textContent = formatCurrency(subtotal);

    const igvElement = document.getElementById('iva') || document.getElementById('igv');
    if (igvElement) igvElement.textContent = formatCurrency(igv);

    document.getElementById('total').textContent = formatCurrency(total);
}

// Función para agregar servicio rápido
function addQuickService(description, price = 0) {
    const tableBody = document.getElementById('quoteTableBody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td><input type="text" class="item-description" value="${description}"></td>
        <td><input type="number" class="item-quantity" value="1" min="1"></td>
        <td><input type="number" class="item-price" value="${price}" min="0"></td>
        <td class="item-subtotal">$0</td>
        <td><button class="btn-remove" onclick="removeRow(this)">×</button></td>
    `;

    tableBody.appendChild(newRow);
    attachRowListeners(newRow);

    // Actualizar subtotales inmediatamente
    updateRowSubtotal(newRow);
    calculateTotals();

    // Notificación visual (opcional)
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = '✓ Agregado';
    setTimeout(() => {
        btn.innerText = originalText;
    }, 1000);
}

// Función para formatear moneda
function formatCurrency(amount) {
    return '$' + amount.toLocaleString('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// Inicializar listeners en la primera fila
document.addEventListener('DOMContentLoaded', () => {
    const firstRow = document.querySelector('#quoteTableBody tr');
    if (firstRow) {
        attachRowListeners(firstRow);
    }
});

// === FUNCIÓN PARA GUARDAR DATOS ===
function saveData() {
    const data = {
        cliente: {
            nombre: document.getElementById('clientName')?.value || '',
            rut: document.getElementById('clientRUT')?.value || '',
            email: document.getElementById('clientEmail')?.value || '',
            telefono: document.getElementById('clientPhone')?.value || '',
            direccion: document.getElementById('clientAddress')?.value || ''
        },
        servicios: [],
        totales: {
            subtotal: document.getElementById('subtotal')?.textContent || '$0',
            igv: (document.getElementById('iva') || document.getElementById('igv'))?.textContent || '$0',
            total: document.getElementById('total')?.textContent || '$0'
        }
    };

    // Guardar servicios
    const rows = document.querySelectorAll('#quoteTableBody tr');
    rows.forEach(row => {
        const descripcion = row.querySelector('.item-description')?.value || '';
        const cantidad = row.querySelector('.item-quantity')?.value || '0';
        const precio = row.querySelector('.item-price')?.value || '0';
        const subtotal = row.querySelector('.item-subtotal')?.textContent || '$0';

        if (descripcion) {
            data.servicios.push({
                descripcion,
                cantidad,
                precio,
                subtotal
            });
        }
    });

    return data;
}

// === FUNCIÓN PARA IMPRIMIR / GENERAR PDF ===
function printQuote() {
    // Validar que haya datos del cliente
    const clientName = document.getElementById('clientName')?.value;
    if (!clientName) {
        alert('Por favor complete al menos el nombre del cliente');
        return;
    }

    // Guardar datos antes de imprimir
    const data = saveData();
    console.log('Datos guardados:', data);

    // Abrir ventana de impresión
    window.print();
}

// === FUNCIÓN PARA COMPARTIR POR WHATSAPP ===
function shareWhatsApp() {
    // Validar que haya datos del cliente
    const clientName = document.getElementById('clientName')?.value;
    if (!clientName) {
        alert('Por favor complete al menos el nombre del cliente');
        return;
    }

    // Guardar datos
    const data = saveData();
    console.log('Datos para WhatsApp:', data);

    // Generar PDF (usar función de imprimir)
    window.print();

    // Mostrar modal de instrucciones
    setTimeout(() => {
        showModal();

        // Abrir WhatsApp Web después de un breve delay
        setTimeout(() => {
            const message = encodeURIComponent(
                `Hola! Te envío la cotización de servicios del Laboratorio CIPDA para ${data.cliente.nombre}.\n\n` +
                `Servicios solicitados: ${data.servicios.length}\n` +
                `Total: ${data.totales.total}\n\n` +
                `Adjunto encontrarás el PDF con los detalles completos.`
            );

            window.open(`https://web.whatsapp.com/send?text=${message}`, '_blank');
        }, 1000);
    }, 500);
}

// === MODAL DE WHATSAPP ===
function showModal() {
    const modal = document.getElementById('whatsappModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('whatsappModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Cerrar modal al hacer click fuera del contenido
document.getElementById('whatsappModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'whatsappModal') {
        closeModal();
    }
});

// === NAVEGACIÓN SUAVE ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// === HEADER SCROLL EFFECT ===
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// === VALIDACIÓN DE FORMULARIO ===
const form = document.getElementById('quoteForm');
form?.addEventListener('submit', (e) => {
    e.preventDefault();
});

// Validación en tiempo real
const emailInput = document.getElementById('clientEmail');
emailInput?.addEventListener('blur', function () {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value && !emailRegex.test(this.value)) {
        this.style.borderColor = '#EF4444';
    } else {
        this.style.borderColor = '#E2E8F0';
    }
});

// Formateo automático de RUT (simple)
const rutInput = document.getElementById('clientRUT');
rutInput?.addEventListener('input', function () {
    let value = this.value.replace(/[^0-9kK]/g, '');
    if (value.length > 1) {
        value = value.slice(0, -1) + '-' + value.slice(-1);
    }
    this.value = value;
});

// === HERO CAROUSEL ===
let slideIndex = 1;
const slides = document.getElementsByClassName("hero-slide");

if (slides.length > 0) {
    showSlides(slideIndex);

    // Auto play
    setInterval(() => {
        plusSlides(1);
    }, 5000);
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName("hero-slide");
    const dots = document.getElementsByClassName("dot");

    if (slides.length === 0) return;

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    for (i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }

    slides[slideIndex - 1].classList.add("active");
    if (dots.length > 0 && dots.length >= slideIndex) {
        dots[slideIndex - 1].classList.add("active");
    }
}

// === CONSOLA DE DESARROLLO ===
console.log('%c🧪 Laboratorio CIPDA - Sistema de Cotización',
    'color: #247BA0; font-size: 14px; font-weight: bold;');
console.log('%cSistema cargado correctamente',
    'color: #2A9D8F; font-size: 12px;');

// === PREGUNTAS FRECUENTES (FAQ) ===
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isActive = item.classList.contains('active');

        // Cerrar todos
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('active');
            const answer = i.querySelector('.faq-answer');
            if (answer) answer.style.maxHeight = null;
        });

        // Abrir actual si no estaba activo
        if (!isActive) {
            item.classList.add('active');
            const answer = item.querySelector('.faq-answer');
            if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});
