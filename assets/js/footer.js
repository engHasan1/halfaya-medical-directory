// Function to load footer into page
function loadFooter() {
    const footer = document.querySelector('footer.main-footer');
    if (footer) {
        footer.innerHTML = '<p>جميع الحقوق محفوظة لدليل حلفايا الطبي - المهندس حسن خالد الرجب</p>';
    }
}

// Load footer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
} else {
    loadFooter();
}

