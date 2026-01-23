#!/usr/bin/env node

/**
 * Reading Recommendation Engine
 * Main Entry Point
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  knowledgeSyncPath: path.expandUser('~/.knowledge-sync/books.json'),
  defaultLimit: 5,
  dataDir: path.join(__dirname, 'data'),
  genresFile: path.join(__dirname, 'data', 'genres.json'),
  themesFile: path.join(__dirname, 'data', 'themes.json')
};

// Genre Definitions
const GENRES = [
  'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery',
  'Thriller', 'Romance', 'Horror', 'Historical', 'Biography',
  'Self-Help', 'Business', 'Science', 'Philosophy', 'Poetry',
  'Adventure', 'Dystopian', 'Cyberpunk', 'Space Opera', 'Classic'
];

// Theme Keywords
const THEMES = {
  'Technology': ['AI', 'robot', 'computer', 'cyber', 'digital', 'future', 'virtual'],
  'Space': ['space', 'galaxy', 'planet', 'star', 'universe', 'alien'],
  'War': ['war', 'battle', 'military', 'soldier', 'conflict'],
  'Love': ['love', 'romance', 'relationship', 'marriage', 'heart'],
  'Identity': ['identity', 'self', 'discovery', 'growth', 'transformation'],
  'Power': ['power', 'politics', 'government', 'control', 'authority'],
  'Survival': ['survival', 'apocalypse', 'disaster', 'danger', 'escape'],
  'Morality': ['morality', 'ethics', 'right', 'wrong', 'choice', 'sacrifice']
};

/**
 * Load books from Knowledge Sync
 */
function loadBooks() {
  try {
    if (fs.existsSync(CONFIG.knowledgeSyncPath)) {
      const data = fs.readFileSync(CONFIG.knowledgeSyncPath, 'utf8');
      return JSON.parse(data);
    }
    // Return demo data if no real data
    return getDemoBooks();
  } catch (error) {
    console.error('Error loading books:', error.message);
    return getDemoBooks();
  }
}

/**
 * Demo books for testing
 */
function getDemoBooks() {
  return [
    { title: 'Foundation', author: 'Isaac Asimov', genre: 'Science Fiction', themes: ['Power', 'Technology'], rating: 4.8, dateRead: '2025-01-15' },
    { title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction', themes: ['Space', 'Power', 'Survival'], rating: 4.9, dateRead: '2025-02-20' },
    { title: 'Snow Crash', author: 'William Gibson', genre: 'Cyberpunk', themes: ['Technology', 'Identity'], rating: 4.5, dateRead: '2025-03-10' },
    { title: '1984', author: 'George Orwell', genre: 'Dystopian', themes: ['Power', 'Morality'], rating: 4.7, dateRead: '2025-04-05' },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', themes: ['Adventure'], rating: 4.6, dateRead: '2025-05-12' },
    { title: 'Neuromancer', author: 'William Gibson', genre: 'Cyberpunk', themes: ['Technology', 'Survival'], rating: 4.4, dateRead: '2025-06-18' },
    { title: 'Brave New World', author: 'Aldous Huxley', genre: 'Dystopian', themes: ['Morality', 'Identity'], rating: 4.3, dateRead: '2025-07-22' },
    { title: 'Ender\'s Game', author: 'Orson Scott Card', genre: 'Science Fiction', themes: ['War', 'Identity'], rating: 4.7, dateRead: '2025-08-30' }
  ];
}

/**
 * Extract themes from book description/title
 */
function extractThemes(book) {
  const text = `${book.title} ${book.author} ${book.genre} ${(book.themes || []).join(' ')}`.toLowerCase();
  const foundThemes = [];
  
  for (const [theme, keywords] of Object.entries(THEMES)) {
    if (keywords.some(kw => text.includes(kw.toLowerCase()))) {
      foundThemes.push(theme);
    }
  }
  
  return foundThemes.length > 0 ? foundThemes : book.themes || [];
}

/**
 * Calculate content-based similarity between two books
 */
function contentSimilarity(bookA, bookB) {
  const genresA = [bookA.genre];
  const genresB = [bookB.genre];
  
  // Genre match
  const genreScore = genresA.includes(bookB.genre) ? 1.0 : 0;
  
  // Theme overlap (Jaccard)
  const themesA = new Set(extractThemes(bookA));
  const themesB = new Set(extractThemes(bookB));
  const intersection = new Set([...themesA].filter(x => themesB.has(x)));
  const union = new Set([...themesA, ...themesB]);
  const themeScore = union.size > 0 ? intersection.size / union.size : 0;
  
  return genreScore * 0.6 + themeScore * 0.4;
}

/**
 * Generate recommendations based on read books
 */
function generateRecommendations(books, options = {}) {
  const limit = options.limit || CONFIG.defaultLimit;
  const genre = options.genre;
  
  // Calculate user preferences based on read books
  const userGenres = {};
  const userThemes = {};
  
  books.forEach(book => {
    userGenres[book.genre] = (userGenres[book.genre] || 0) + book.rating;
    extractThemes(book).forEach(theme => {
      userThemes[theme] = (userThemes[theme] || 0) + book.rating;
    });
  });
  
  // Sort genres by preference
  const topGenres = Object.entries(userGenres)
    .sort((a, b) => b[1] - a[1])
    .map(([genre]) => genre);
  
  // Known books for exclusion
  const knownBooks = new Set(books.map(b => b.title.toLowerCase()));
  
  // Generate recommendations (simulated book database)
  const recommendations = [];
  const candidateBooks = getCandidateBooks(topGenres);
  
  candidateBooks
    .filter(book => !knownBooks.has(book.title.toLowerCase()))
    .filter(book => !genre || book.genre === genre)
    .sort((a, b) => {
      const scoreA = calculateRecommendationScore(a, books, userGenres, userThemes);
      const scoreB = calculateRecommendationScore(b, books, userGenres, userThemes);
      return scoreB - scoreA;
    })
    .slice(0, limit)
    .forEach(book => {
      recommendations.push({
        ...book,
        score: calculateRecommendationScore(book, books, userGenres, userThemes),
        reason: getRecommendationReason(book, books)
      });
    });
  
  return recommendations;
}

/**
 * Get candidate books (simulated database)
 */
function getCandidateBooks(preferredGenres) {
  return [
    { title: 'Hyperion', author: 'Dan Simmons', genre: 'Science Fiction', themes: ['Technology', 'Power'], rating: 4.6 },
    { title: 'Left Hand of Darkness', author: 'Ursula K. Le Guin', genre: 'Science Fiction', themes: ['Identity', 'Morality'], rating: 4.5 },
    { title: 'Foundation and Empire', author: 'Isaac Asimov', genre: 'Science Fiction', themes: ['Power', 'War'], rating: 4.5 },
    { title: 'The Dispossessed', author: 'Ursula K. Le Guin', genre: 'Science Fiction', themes: ['Power', 'Morality'], rating: 4.4 },
    { title: 'Culture Series Bundle', author: 'Iain M. Banks', genre: 'Science Fiction', themes: ['Technology', 'Power'], rating: 4.7 },
    { title: 'Lord of the Rings', author: 'J.R.R. Tolkien', genre: 'Fantasy', themes: ['Adventure', 'Power'], rating: 4.9 },
    { title: 'Mistborn', author: 'Brandon Sanderson', genre: 'Fantasy', themes: ['Power', 'Survival'], rating: 4.6 },
    { title: 'The Circle', author: 'Dave Eggers', genre: 'Dystopian', themes: ['Technology', 'Power'], rating: 4.0 },
    { title: 'Ready Player One', author: 'Ernest Cline', genre: 'Science Fiction', themes: ['Technology', 'Adventure'], rating: 4.3 },
    { title: 'Old Man\'s War', author: 'John Scalzi', genre: 'Science Fiction', themes: ['War', 'Survival'], rating: 4.4 }
  ];
}

/**
 * Calculate recommendation score for a book
 */
function calculateRecommendationScore(book, readBooks, userGenres, userThemes) {
  // Content-based score
  const contentScores = readBooks.map(readBook => contentSimilarity(readBook, book));
  const contentScore = contentScores.length > 0 
    ? contentScores.reduce((a, b) => a + b, 0) / contentScores.length 
    : 0;
  
  // Genre preference score
  const genreScore = userGenres[book.genre] ? 1.0 : 0;
  
  // Theme preference score
  const bookThemes = extractThemes(book);
  const themeScores = bookThemes.map(t => userThemes[t] ? 1.0 : 0);
  const themeScore = themeScores.length > 0 
    ? themeScores.reduce((a, b) => a + b, 0) / themeScores.length 
    : 0;
  
  return contentScore * 0.4 + genreScore * 0.3 + themeScore * 0.3;
}

/**
 * Get reason why book is recommended
 */
function getRecommendationReason(book, readBooks) {
  const similar = readBooks
    .map(b => ({ book: b, similarity: contentSimilarity(b, book) }))
    .sort((a, b) => b.similarity - a.similarity)[0];
  
  if (similar && similar.similarity > 0.3) {
    return `Weil du "${similar.book.title}" von ${similar.book.author} gelesen hast`;
  }
  
  return `Passend zu deinem Genre: ${book.genre}`;
}

/**
 * CLI Interface
 */
function main() {
  const args = process.argv.slice(2);
  
  // Parse options
  const options = {
    genre: null,
    limit: CONFIG.defaultLimit
  };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--genre' && args[i + 1]) {
      options.genre = args[i + 1];
      i++;
    } else if (args[i] === '--limit' && args[i + 1]) {
      options.limit = parseInt(args[i + 1], 10);
      i++;
    }
  }
  
  // Load books and generate recommendations
  const books = loadBooks();
  const recommendations = generateRecommendations(books, options);
  
  // Output
  console.log('\n📚 Buchempfehlungen für dich:\n');
  
  if (recommendations.length === 0) {
    console.log('Keine Empfehlungen gefunden. Lese mehr Bücher! 📚');
    return;
  }
  
  recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. "${rec.title}" von ${rec.author} (⭐ ${rec.rating})`);
    console.log(`   → ${rec.reason}`);
    console.log(`   → Genre: ${rec.genre}, Themen: ${rec.themes.join(', ')}`);
    console.log('');
  });
  
  console.log(`Basierend auf ${books.length} gelesenen Büchern.\n`);
}

// Export for testing
module.exports = {
  loadBooks,
  generateRecommendations,
  contentSimilarity,
  extractThemes,
  CONFIG
};

// Run if called directly
if (require.main === module) {
  main();
}
