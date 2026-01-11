// ===== VARIABLES GLOBALES =====
let currentSlide = 0;
let currentTestimonial = 0;
let currentStep = 1;
let autoSlideInterval;
let autoTestimonialInterval;

// ===== FUNCIONES DE INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initNavigation();
    initCarousel();
    // initTestimonials();
    initQuoteSystem();
    initFAQ();
    initScrollEffects();
    initModal();
    
    console.log('Laboratorio CIPDA - Sitio web cargado y listo');
});

// ===== NAVEGACIÓN RESPONSIVE =====
function initNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.querySelector('.nav-right');
    const navLinks = document.querySelectorAll('.nav-link');
    
    mobileToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Cambiar icono del botón
        const spans = this.querySelectorAll('span');
        spans.forEach(span => span.style.transition = 'all 0.3s ease');
    });
    
    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Header con scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== CARRUSEL HERO =====
function initCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.carousel-indicators .dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    // Configurar intervalos automáticos
    autoSlideInterval = setInterval(nextSlide, 5000);
    
    // Botones de navegación
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Indicadores de puntos
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Pausar carrusel al hacer hover
    const hero = document.querySelector('.hero');
    hero.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    hero.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    });
    
    // Funciones del carrusel
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    function updateCarousel() {
        // Actualizar slides
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        // Actualizar puntos
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
}

// ===== TESTIMONIOS DESLIZANTES (DESACTIVADO) =====
/*
function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (testimonials.length === 0) return;
    
    // Configurar intervalos automáticos
    autoTestimonialInterval = setInterval(nextTestimonial, 7000);
    
    // Botones de navegación
    if (prevBtn) {
        prevBtn.addEventListener('click', prevTestimonial);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextTestimonial);
    }
    
    // Indicadores de puntos
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToTestimonial(index));
    });
    
    // Funciones de testimonios
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        updateTestimonials();
    }
    
    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        updateTestimonials();
    }
    
    function goToTestimonial(index) {
        currentTestimonial = index;
        updateTestimonials();
    }
    
    function updateTestimonials() {
        // Actualizar testimonios
        testimonials.forEach((testimonial, index) => {
            testimonial.classList.toggle('active', index === currentTestimonial);
        });
        
        // Actualizar puntos
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentTestimonial);
        });
    }
}
*/

// ===== SISTEMA DE COTIZACIÓN =====
function initQuoteSystem() {
    const serviceOptions = document.querySelectorAll('.service-option input[type="checkbox"]');
    const nextBtn = document.querySelector('.btn-next');
    const prevBtn = document.querySelector('.btn-outline[onclick="prevStep()"]');
    
    // Calcular precios al seleccionar servicios
    serviceOptions.forEach(option => {
        option.addEventListener('change', updateQuoteSummary);
    });
    
    // Actualizar campo de servicio personalizado
    const customService = document.getElementById('customService');
    if (customService) {
        customService.addEventListener('input', updateQuoteSummary);
    }
    
    // Actualizar formulario
    const formInputs = document.querySelectorAll('#quoteForm input, #quoteForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', updateQuoteSummary);
    });
    
    // Inicializar resumen
    updateQuoteSummary();
}

function nextStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    currentStepElement.classList.remove('active');
    
    currentStep++;
    const nextStepElement = document.getElementById(`step${currentStep}`);
    nextStepElement.classList.add('active');
    
    // Desplazar a la sección de cotización
    document.getElementById('cotizacion').scrollIntoView({ behavior: 'smooth' });
}

function prevStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    currentStepElement.classList.remove('active');
    
    currentStep--;
    const prevStepElement = document.getElementById(`step${currentStep}`);
    prevStepElement.classList.add('active');
}

function updateQuoteSummary() {
    // Obtener servicios seleccionados
    const selectedServices = [];
    document.querySelectorAll('.service-option input[type="checkbox"]:checked').forEach(checkbox => {
        selectedServices.push(checkbox.value);
    });
    
    // Agregar servicio personalizado si existe
    const customService = document.getElementById('customService');
    if (customService && customService.value.trim()) {
        selectedServices.push(customService.value);
    }
    
    // Calcular precio estimado (esto es un ejemplo, deberías tener precios reales)
    const basePrice = 150; // Precio base por servicio
    const estimatedTotal = selectedServices.length * basePrice;
    const igv = estimatedTotal * 0.18;
    const total = estimatedTotal + igv;
    
    // Actualizar resumen
    const clientName = document.getElementById('clientName').value || 'No especificado';
    const clientRUC = document.getElementById('clientRUC').value || 'No especificado';
    
    document.getElementById('summaryClient').textContent = clientName;
    document.getElementById('summaryRUC').textContent = clientRUC;
    document.getElementById('summaryServices').textContent = selectedServices.length > 0 
        ? selectedServices.join(', ') 
        : 'No se seleccionaron servicios';
    
    document.getElementById('summaryTotal').textContent = `S/ ${total.toFixed(2)}`;
}

function generateQuote() {
    // Validar formulario
    const requiredFields = ['clientName', 'clientRUC', 'clientEmail', 'clientPhone'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--danger-color)';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    if (!isValid) {
        alert('Por favor, complete todos los campos obligatorios marcados con *');
        return;
    }
    
    // Ir al paso 3
    const currentStepElement = document.getElementById(`step${currentStep}`);
    currentStepElement.classList.remove('active');
    
    currentStep = 3;
    const nextStepElement = document.getElementById(`step${currentStep}`);
    nextStepElement.classList.add('active');
    
    // Actualizar resumen final
    updateQuoteSummary();
    
    // Mostrar modal de confirmación
    showModal();
}

function downloadQuote() {
    // Crear contenido HTML para el PDF
    const quoteContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { text-align: center; margin-bottom: 30px; }
                .logo { font-size: 24px; font-weight: bold; color: #2c3e50; }
                .title { font-size: 28px; margin: 20px 0; color: #3498db; }
                .section { margin: 20px 0; }
                .section-title { background: #f8f9fa; padding: 10px; font-weight: bold; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .total { font-size: 20px; font-weight: bold; color: #27ae60; text-align: right; }
                .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #7f8c8d; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">CIPDA LABORATORIO</div>
                <div class="title">COTIZACIÓN DE SERVICIOS</div>
                <div>Fecha: ${new Date().toLocaleDateString()}</div>
                <div>Código: CIPDA-${Date.now().toString().slice(-6)}</div>
            </div>
            
            <div class="section">
                <div class="section-title">DATOS DEL CLIENTE</div>
                <div class="info-grid">
                    <div><strong>Cliente:</strong> ${document.getElementById('clientName').value}</div>
                    <div><strong>RUC:</strong> ${document.getElementById('clientRUC').value}</div>
                    <div><strong>Email:</strong> ${document.getElementById('clientEmail').value}</div>
                    <div><strong>Teléfono:</strong> ${document.getElementById('clientPhone').value}</div>
                    <div><strong>Dirección:</strong> ${document.getElementById('clientAddress').value || 'No especificada'}</div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">SERVICIOS SOLICITADOS</div>
                <ul>
                    ${Array.from(document.querySelectorAll('.service-option input[type="checkbox"]:checked'))
                        .map(cb => `<li>${cb.value}</li>`).join('')}
                    ${document.getElementById('customService').value.trim() ? 
                        `<li>${document.getElementById('customService').value}</li>` : ''}
                </ul>
            </div>
            
            <div class="section">
                <div class="section-title">RESUMEN DE COSTOS</div>
                <div style="text-align: right;">
                    <div>Subtotal: S/ ${(document.querySelectorAll('.service-option input[type="checkbox"]:checked').length * 150).toFixed(2)}</div>
                    <div>IGV (18%): S/ ${(document.querySelectorAll('.service-option input[type="checkbox"]:checked').length * 150 * 0.18).toFixed(2)}</div>
                    <div class="total">TOTAL: S/ ${(document.querySelectorAll('.service-option input[type="checkbox"]:checked').length * 150 * 1.18).toFixed(2)}</div>
                </div>
            </div>
            
            <div class="footer">
                <p>Laboratorio CIPDA - Centro de Investigación y Pruebas de Diagnóstico Ambiental</p>
                <p>Av. Confraternidad Int. Oeste 589, Huaraz, Ancash | Tel: +51 921 593 127 | cipdalab@gmail.com</p>
                <p>Esta cotización es válida por 30 días a partir de la fecha de emisión</p>
            </div>
        </body>
        </html>
    `;
    
    // Crear y descargar PDF
    const blob = new Blob([quoteContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cotizacion_CIPDA_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Cotización descargada');
}

function sendWhatsApp() {
    const clientName = document.getElementById('clientName').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const services = Array.from(document.querySelectorAll('.service-option input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    const message = `Hola, soy ${clientName}. Solicito cotización para los siguientes servicios: ${services.join(', ')}. Mi teléfono es ${clientPhone}.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/51921593127?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

function newQuote() {
    // Resetear formulario
    document.querySelectorAll('.service-option input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('customService').value = '';
    document.querySelectorAll('#quoteForm input, #quoteForm textarea').forEach(input => input.value = '');
    
    // Volver al paso 1
    const currentStepElement = document.getElementById(`step${currentStep}`);
    currentStepElement.classList.remove('active');
    
    currentStep = 1;
    const step1Element = document.getElementById(`step${currentStep}`);
    step1Element.classList.add('active');
    
    updateQuoteSummary();
}

// ===== FAQ ACORDEÓN =====
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            
            if (this.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
            
            // Cerrar otras preguntas
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this && otherQuestion.classList.contains('active')) {
                    otherQuestion.classList.remove('active');
                    otherQuestion.nextElementSibling.style.maxHeight = '0';
                }
            });
        });
    });
}

// ===== EFECTOS DE SCROLL =====
function initScrollEffects() {
    // Botón de scroll to top
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
        
        // Animación de elementos al hacer scroll
        animateOnScroll();
    });
    
    // Scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Botón de scroll to top
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Animación de elementos al cargar
    animateOnScroll();
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in, .service-card, .gallery-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// ===== MODAL =====
function initModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    // Cerrar con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}

function showModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.add('active');
    }
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
}

// ===== FUNCIONES GLOBALES =====
window.currentSlide = function(n) {
    // Función de compatibilidad para el carrusel original
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.carousel-indicators .dot');
    
    currentSlide = n - 1;
    
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
};

window.addQuickService = function(service) {
    // Función de compatibilidad para agregar servicios rápidamente
    const serviceOptions = document.querySelectorAll('.service-option input[type="checkbox"]');
    
    serviceOptions.forEach(option => {
        if (option.value === service) {
            option.checked = true;
            option.dispatchEvent(new Event('change'));
        }
    });
    
    // Ir a la sección de cotización
    document.getElementById('cotizacion').scrollIntoView({ behavior: 'smooth' });
};

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', function(e) {
    console.error('Error en la página:', e.error);
});

// ===== OFFLINE SUPPORT =====
window.addEventListener('online', function() {
    console.log('Conectado a internet');
});

window.addEventListener('offline', function() {
    console.log('Sin conexión a internet');
});