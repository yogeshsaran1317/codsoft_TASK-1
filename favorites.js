/* favorites.js */
document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
});

function loadFavorites() {
    const gridEl = document.getElementById('favorites-grid');
    const emptyState = document.getElementById('favorites-empty-state');
    if (!gridEl || !emptyState) return;

    const favorites = JSON.parse(localStorage.getItem('favoriteQuotes') || '[]');

    if (favorites.length === 0) {
        emptyState.classList.remove('hidden');
        gridEl.innerHTML = '';
        return;
    }

    emptyState.classList.add('hidden');
    gridEl.innerHTML = '';

    favorites.forEach((quote, index) => {
        const card = document.createElement('div');
        card.className = 'quote-card glass-effect';
        
        card.innerHTML = `
            <div class="quote-content">
                <i class="fa-solid fa-quote-left quote-icon-small"></i>
                <p class="quote-text-small">"${quote.text}"</p>
                <p class="quote-author-small">- ${quote.author || 'Unknown'}</p>
            </div>
            <div class="quote-actions">
                <button class="action-btn favorite-btn active" onclick="removeFavorite(${index})" title="Remove from Favorites">
                    <i class="fa-solid fa-heart"></i>
                </button>
                <button class="action-btn share-btn" title="Share Quote">
                    <i class="fa-solid fa-share-nodes"></i>
                </button>
            </div>
        `;

        const shareBtn = card.querySelector('.share-btn');
        shareBtn.addEventListener('click', () => shareQuote({text: quote.text, author: quote.author}));

        gridEl.appendChild(card);
    });
}

// Global scope for onclick
window.removeFavorite = function(index) {
    let favorites = JSON.parse(localStorage.getItem('favoriteQuotes') || '[]');
    favorites.splice(index, 1);
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
    loadFavorites();
};

function shareQuote(quote) {
    const shareText = `"${quote.text}" - ${quote.author || 'Unknown'}\n\nShared from InspireMe`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Inspiring Quote',
            text: shareText,
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Quote copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to share quote.');
        });
    }
}
