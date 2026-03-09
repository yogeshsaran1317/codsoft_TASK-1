/* app.js */
const quotesData = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "Do not wait for leaders; do it alone, person to person.", author: "Mother Teresa" },
    { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
    { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" }
];

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // 1. Load Admin Quotes and merge with base quotes
    const adminQuotes = JSON.parse(localStorage.getItem('adminQuotes') || '[]');
    const allQuotes = [...adminQuotes, ...quotesData];

    // 2. Select Today's Quote
    let todayQuote = null;
    
    // Check if an admin specified a featured quote recently
    const featuredAdminQuote = adminQuotes.find(q => q.featured === true);
    
    if (featuredAdminQuote) {
        todayQuote = featuredAdminQuote;
        // Optional: clear the featured flag after assigning it so it changes next day, 
        // but since we want the admin quote to be highly visible as requested, we'll keep it.
    } else {
        // Daily rotation logic based on the date
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const index = dayOfYear % allQuotes.length;
        todayQuote = allQuotes[index];
    }

    displayTodayQuote(todayQuote);
    
    // 3. Display remaining quotes in the grid
    const remainingQuotes = allQuotes.filter(q => q.text !== todayQuote.text);
    // Shuffle the remaining quotes for variety
    const shuffledQuotes = remainingQuotes.sort(() => 0.5 - Math.random());
    displayQuotesGrid(shuffledQuotes.slice(0, 8)); // Display up to 8 more quotes
}

function displayTodayQuote(quote) {
    const textEl = document.getElementById('today-quote-text');
    const authorEl = document.getElementById('today-quote-author');
    const favBtn = document.getElementById('today-favorite-btn');
    const shareBtn = document.getElementById('today-share-btn');

    if (textEl && authorEl) {
        textEl.textContent = `"${quote.text}"`;
        authorEl.textContent = `- ${quote.author || 'Unknown'}`;
    }

    if (favBtn) {
        // Check if favorite
        const favorites = JSON.parse(localStorage.getItem('favoriteQuotes') || '[]');
        const isFav = favorites.find(q => q.text === quote.text);
        
        if (isFav) {
            favBtn.classList.add('active');
            favBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        } else {
            favBtn.classList.remove('active');
            favBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
        }

        favBtn.onclick = () => toggleFavorite(quote, favBtn);
    }

    if (shareBtn) {
        shareBtn.onclick = () => shareQuote(quote);
    }
}

function displayQuotesGrid(quotes) {
    const gridEl = document.getElementById('quotes-grid');
    if (!gridEl) return;

    gridEl.innerHTML = ''; // Clear loading state

    quotes.forEach(quote => {
        const card = document.createElement('div');
        card.className = 'quote-card glass-effect';
        
        // Check favorite status
        const favorites = JSON.parse(localStorage.getItem('favoriteQuotes') || '[]');
        const isFav = favorites.find(q => q.text === quote.text);
        const heartIcon = isFav ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
        const activeClass = isFav ? 'active' : '';

        card.innerHTML = `
            <div class="quote-content">
                <i class="fa-solid fa-quote-left quote-icon-small"></i>
                <p class="quote-text-small">"${quote.text}"</p>
                <p class="quote-author-small">- ${quote.author || 'Unknown'}</p>
            </div>
            <div class="quote-actions">
                <button class="action-btn favorite-btn ${activeClass}" title="Save to Favorites">
                    ${heartIcon}
                </button>
                <button class="action-btn share-btn" title="Share Quote">
                    <i class="fa-solid fa-share-nodes"></i>
                </button>
            </div>
        `;

        // Attach listeners
        const favBtn = card.querySelector('.favorite-btn');
        favBtn.addEventListener('click', () => toggleFavorite({text: quote.text, author: quote.author}, favBtn));

        const shareBtn = card.querySelector('.share-btn');
        shareBtn.addEventListener('click', () => shareQuote({text: quote.text, author: quote.author}));

        gridEl.appendChild(card);
    });
}

function toggleFavorite(quote, buttonElement) {
    let favorites = JSON.parse(localStorage.getItem('favoriteQuotes') || '[]');
    
    const existingIndex = favorites.findIndex(q => q.text === quote.text);
    
    if (existingIndex !== -1) {
        // Remove from favorites
        favorites.splice(existingIndex, 1);
        buttonElement.classList.remove('active');
        buttonElement.innerHTML = '<i class="fa-regular fa-heart"></i>';
    } else {
        // Add to favorites
        favorites.push({ text: quote.text, author: quote.author });
        buttonElement.classList.add('active');
        buttonElement.innerHTML = '<i class="fa-solid fa-heart"></i>';
    }
    
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
}

function shareQuote(quote) {
    const shareText = `"${quote.text}" - ${quote.author || 'Unknown'}\n\nShared from InspireMe`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Inspiring Quote',
            text: shareText,
        }).catch(console.error);
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Quote copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to share quote.');
        });
    }
}
