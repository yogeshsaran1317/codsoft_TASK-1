/* admin.js */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-quote-form');
    const clearBtn = document.getElementById('clear-data-btn');

    loadAdminQuotes();

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const textInput = document.getElementById('quote-input').value.trim();
            const authorInput = document.getElementById('author-input').value.trim();
            const featuredInput = document.getElementById('feature-checkbox').checked;

            if (textInput) {
                addAdminQuote(textInput, authorInput, featuredInput);
                form.reset();
                showSuccessMessage();
                loadAdminQuotes();
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear all added quotes and favorites?")) {
                localStorage.removeItem('adminQuotes');
                localStorage.removeItem('favoriteQuotes');
                loadAdminQuotes();
                alert("All application data cleared.");
            }
        });
    }
});

function addAdminQuote(text, author, featured) {
    let adminQuotes = JSON.parse(localStorage.getItem('adminQuotes') || '[]');
    
    // If this new quote is featured, un-feature all other admin quotes
    if (featured) {
        adminQuotes = adminQuotes.map(q => ({ ...q, featured: false }));
    }

    // Add to the front of the array (newest first)
    adminQuotes.unshift({
        text,
        author: author || 'Unknown',
        featured,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem('adminQuotes', JSON.stringify(adminQuotes));
}

function loadAdminQuotes() {
    const container = document.getElementById('admin-quotes-container');
    if (!container) return;

    const adminQuotes = JSON.parse(localStorage.getItem('adminQuotes') || '[]');
    
    if (adminQuotes.length === 0) {
        container.innerHTML = '<p class="empty-text">No custom quotes added yet.</p>';
        return;
    }

    container.innerHTML = '';

    adminQuotes.forEach((quote, index) => {
        const item = document.createElement('div');
        item.className = 'admin-quote-item glass-effect';
        
        const featuredBadge = quote.featured ? '<span class="badge featured-badge">Featured</span>' : '';
        
        item.innerHTML = `
            <div class="admin-quote-content">
                <p class="quote-text-small">"${quote.text}"</p>
                <div class="admin-quote-meta">
                    <span class="quote-author-small">- ${quote.author || 'Unknown'}</span>
                    ${featuredBadge}
                </div>
            </div>
            <button class="danger-btn icon-only" onclick="deleteAdminQuote(${index})" title="Delete Quote">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        container.appendChild(item);
    });
}

// Global scope for onclick
window.deleteAdminQuote = function(index) {
    if (confirm('Delete this quote?')) {
        let adminQuotes = JSON.parse(localStorage.getItem('adminQuotes') || '[]');
        adminQuotes.splice(index, 1);
        localStorage.setItem('adminQuotes', JSON.stringify(adminQuotes));
        loadAdminQuotes();
    }
};

function showSuccessMessage() {
    const msg = document.getElementById('success-message');
    if (msg) {
        msg.classList.remove('hidden');
        msg.classList.add('fade-in');
        
        setTimeout(() => {
            msg.classList.replace('fade-in', 'fade-out');
            setTimeout(() => {
                msg.classList.add('hidden');
                msg.classList.remove('fade-out');
            }, 300);
        }, 3000);
    }
}
