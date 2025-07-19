// SEO Pro - Main JavaScript File

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('SEO Pro website initialized successfully!');
    
    // Load modular components 
    if (typeof loadComponents === 'function') {
        loadComponents().then(() => {
            initializeAllFeatures();
        }).catch(error => {
            console.warn('Component loading failed:', error);
            initializeAllFeatures();
        });
    } else {
        initializeAllFeatures();
    }
});

function initializeAllFeatures() {
    try {
        initNavigation();
        initContactForm();
        initPortfolioFilter();
        initBlogFilter();
        initSearchFunctionality();
        initAnimations();
        initSmoothScrolling();
        
        // Breadcrumbs and nav only if functions exist
        if (typeof initBreadcrumbs === 'function') initBreadcrumbs();
        if (typeof setActiveNavItem === 'function') setActiveNavItem();
        if (typeof initCounters === 'function') initCounters();
    } catch (error) {
        console.warn('Feature initialization error:', error);
    }
}

// === NAVIGATION ===
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // Handle navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = '';
            navbar.style.backdropFilter = '';
        }
    });

    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
}

// === CONTACT FORM ===
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Mengirim...';

        // Collect form data
        const formData = collectFormData(contactForm);
        
        // Simulate form submission (replace with actual form handler)
        setTimeout(() => {
            // Reset form
            contactForm.reset();
            
            // Show success modal
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();
            
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Send to WhatsApp as backup
            sendToWhatsApp(formData);
            
        }, 2000);
    });

    // Real-time validation
    const requiredFields = contactForm.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(field);
        });
    });
}

function collectFormData(form) {
    const data = {};
    const formData = new FormData(form);
    
    // Basic fields
    data.nama = form.querySelector('#nama').value;
    data.email = form.querySelector('#email').value;
    data.phone = form.querySelector('#phone').value;
    data.bisnis = form.querySelector('#bisnis').value;
    data.kategori = form.querySelector('#kategori').value;
    data.website = form.querySelector('#website').value;
    data.budget = form.querySelector('#budget').value;
    data.timeline = form.querySelector('#timeline').value;
    data.pesan = form.querySelector('#pesan').value;
    
    // Services needed
    data.layanan = [];
    const services = form.querySelectorAll('input[type="checkbox"]:checked');
    services.forEach(service => {
        data.layanan.push(service.value);
    });
    
    // Preferred contact
    const preferredContact = form.querySelector('input[name="kontakPreferred"]:checked');
    data.kontakPreferred = preferredContact ? preferredContact.value : 'whatsapp';
    
    return data;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.closest('.col-12, .col-md-6, .col-6');
    
    // Remove existing feedback
    const existingFeedback = fieldGroup.querySelector('.invalid-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    field.classList.remove('is-invalid', 'is-valid');
    
    // Validate
    let isValid = true;
    let message = '';
    
    if (field.required && !value) {
        isValid = false;
        message = 'Field ini wajib diisi';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        message = 'Format email tidak valid';
    } else if (field.type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        message = 'Format nomor telepon tidak valid';
    }
    
    // Apply validation result
    if (!isValid) {
        field.classList.add('is-invalid');
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = message;
        fieldGroup.appendChild(feedback);
    } else if (value) {
        field.classList.add('is-valid');
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

function sendToWhatsApp(data) {
    const message = `*Konsultasi SEO UMKM*%0A%0A` +
                   `*Nama:* ${data.nama}%0A` +
                   `*Email:* ${data.email}%0A` +
                   `*WhatsApp:* ${data.phone}%0A` +
                   `*Bisnis:* ${data.bisnis || 'Tidak disebutkan'}%0A` +
                   `*Kategori:* ${data.kategori}%0A` +
                   `*Website:* ${data.website || 'Belum ada'}%0A` +
                   `*Budget:* ${data.budget || 'Fleksibel'}%0A` +
                   `*Timeline:* ${data.timeline || 'Fleksibel'}%0A` +
                   `*Layanan:* ${data.layanan.join(', ') || 'Konsultasi umum'}%0A%0A` +
                   `*Pesan:*%0A${data.pesan}`;
    
    const whatsappURL = `https://wa.me/6281234567890?text=${message}`;
    
    // Open WhatsApp in new tab after a delay
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
    }, 3000);
}

// === PORTFOLIO FILTER ===
function initPortfolioFilter() {
    // Make filterPortfolio available globally
    window.filterPortfolio = function(category) {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        const filterButtons = document.querySelectorAll('button[onclick*="filterPortfolio"]');
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Filter items
        portfolioItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
                item.classList.remove('hidden');
            } else {
                item.style.display = 'none';
                item.classList.add('hidden');
            }
        });
    };
}

// === BLOG FILTER ===
function initBlogFilter() {
    // Make filterBlog available globally
    window.filterBlog = function(category) {
        const blogItems = document.querySelectorAll('.blog-item');
        const filterButtons = document.querySelectorAll('button[onclick*="filterBlog"]');
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Filter items
        blogItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
                item.classList.remove('hidden');
            } else {
                item.style.display = 'none';
                item.classList.add('hidden');
            }
        });
    };

    // Load more functionality
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more articles
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Memuat...';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check me-2"></i>Semua Artikel Dimuat';
                this.disabled = true;
                this.classList.replace('btn-outline-primary', 'btn-success');
            }, 1500);
        });
    }
}

// === SEARCH FUNCTIONALITY ===
function initSearchFunctionality() {
    window.searchArticles = function() {
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (!searchTerm) {
            alert('Masukkan kata kunci pencarian');
            return;
        }
        
        const blogItems = document.querySelectorAll('.blog-item');
        let foundItems = 0;
        
        blogItems.forEach(item => {
            const title = item.querySelector('.card-title').textContent.toLowerCase();
            const content = item.querySelector('.card-text').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                item.style.display = 'block';
                item.classList.remove('hidden');
                foundItems++;
            } else {
                item.style.display = 'none';
                item.classList.add('hidden');
            }
        });
        
        // Show results message
        showSearchResults(foundItems, searchTerm);
    };

    // Search on Enter key
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                window.searchArticles();
            }
        });
    }
}

function showSearchResults(count, term) {
    // Remove existing search results message
    const existingMessage = document.querySelector('.search-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create and show new message
    const message = document.createElement('div');
    message.className = 'alert alert-info search-results-message';
    message.innerHTML = `
        <i class="fas fa-search me-2"></i>
        Menampilkan ${count} artikel untuk "<strong>${term}</strong>"
        <button type="button" class="btn-close float-end" onclick="clearSearch()"></button>
    `;
    
    const blogGrid = document.getElementById('blogGrid');
    if (blogGrid) {
        blogGrid.parentNode.insertBefore(message, blogGrid);
    }
}

window.clearSearch = function() {
    // Clear search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Show all items
    const blogItems = document.querySelectorAll('.blog-item');
    blogItems.forEach(item => {
        item.style.display = 'block';
        item.classList.remove('hidden');
    });
    
    // Remove search message
    const searchMessage = document.querySelector('.search-results-message');
    if (searchMessage) {
        searchMessage.remove();
    }
};

// === ANIMATIONS ===
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    const animateElements = document.querySelectorAll('.card, section > .container > .row');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// === SMOOTH SCROLLING ===
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.length > 1) { // Ensure href is not just '#'
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// === UTILITY FUNCTIONS ===

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format phone number
function formatPhoneNumber(phone) {
    // Convert to Indonesian format
    let formatted = phone.replace(/\D/g, '');
    if (formatted.startsWith('0')) {
        formatted = '62' + formatted.substring(1);
    } else if (!formatted.startsWith('62')) {
        formatted = '62' + formatted;
    }
    return formatted;
}

// Show toast notification
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    // Add to toast container or create one
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove element after hiding
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Teks berhasil disalin!', 'success');
    }).catch(() => {
        showToast('Gagal menyalin teks', 'danger');
    });
}

// === ERROR HANDLING ===
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can add error reporting here
});

// === PERFORMANCE MONITORING ===
window.addEventListener('load', function() {
    // Log page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
});

// === SERVICE WORKER REGISTRATION ===
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// === MODULAR COMPONENTS ===

// Load modular components
async function loadComponents() {
    const components = [
        { id: 'header-container', file: 'components/header.html' },
        { id: 'footer-container', file: 'components/footer.html' },
        { id: 'breadcrumb-container', file: 'components/breadcrumb.html' },
        { id: 'sidebar-container', file: 'components/sidebar.html' },
        { id: 'achievements-container', file: 'components/achievements.html' },
        { id: 'testimonials-container', file: 'components/testimonials.html' },
        { id: 'brands-container', file: 'components/brands.html' }
    ];

    const promises = components.map(async (component) => {
        const container = document.getElementById(component.id);
        if (container) {
            try {
                const response = await fetch(component.file);
                if (response.ok) {
                    const html = await response.text();
                    container.innerHTML = html;
                }
            } catch (error) {
                console.warn(`Could not load component: ${component.file}`, error);
            }
        }
    });

    await Promise.all(promises);
}

// Initialize breadcrumbs
function initBreadcrumbs() {
    const breadcrumbNav = document.getElementById('breadcrumbNav');
    if (!breadcrumbNav) return;

    const currentPage = getCurrentPageInfo();
    if (!currentPage) return;

    let breadcrumbs = [
        { name: 'Beranda', url: 'index.html' }
    ];

    // Add parent pages if needed
    if (currentPage.parent) {
        breadcrumbs.push(currentPage.parent);
    }

    // Add current page
    breadcrumbs.push({ name: currentPage.name, url: null });

    // Generate breadcrumb HTML
    const breadcrumbHTML = breadcrumbs.map((item, index) => {
        if (index === breadcrumbs.length - 1) {
            return `<li class="breadcrumb-item active" aria-current="page">${item.name}</li>`;
        } else {
            return `<li class="breadcrumb-item"><a href="${item.url}" class="text-decoration-none">${item.name}</a></li>`;
        }
    }).join('');

    breadcrumbNav.innerHTML = breadcrumbHTML;
}

// Get current page information
function getCurrentPageInfo() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';

    const pageMap = {
        'index.html': { name: 'Beranda' },
        'about.html': { name: 'Tentang' },
        'services.html': { name: 'Layanan' },
        'portfolio.html': { name: 'Portofolio' },
        'blog.html': { name: 'Blog' },
        'contact.html': { name: 'Kontak' },
        'seo-untuk-umkm.html': { 
            name: 'SEO untuk UMKM', 
            parent: { name: 'Blog', url: 'blog.html' }
        },
        'klien-umkm-makanan.html': { 
            name: 'Studi Kasus: UMKM Makanan', 
            parent: { name: 'Portofolio', url: 'portfolio.html' }
        }
    };

    return pageMap[filename] || null;
}

// Set active navigation item
function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
            link.parentElement.classList.add('active');
        } else {
            link.classList.remove('active');
            link.parentElement.classList.remove('active');
        }
    });
}

// Search from sidebar
window.searchFromSidebar = function() {
    const sidebarInput = document.getElementById('sidebarSearchInput');
    const mainInput = document.getElementById('searchInput');
    
    if (sidebarInput && mainInput) {
        mainInput.value = sidebarInput.value;
        window.searchArticles();
    }
};

// Initialize counter animations for achievements
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                let current = 0;
                const increment = target / 50;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Add counter initialization to component loading
async function loadComponentsWithCounters() {
    await loadComponents();
    setTimeout(() => {
        initCounters();
    }, 100);
}
