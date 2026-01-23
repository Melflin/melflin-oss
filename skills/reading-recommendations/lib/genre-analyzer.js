/**
 * Genre Analyzer Module
 * Extrahiert Genres und Themen aus Büchern
 */

const fs = require('fs');
const path = require('path');

// Genre Database mit Sub-Genres
const GENRE_DATABASE = {
  'Science Fiction': {
    subGenres: ['Space Opera', 'Cyberpunk', 'Hard Sci-Fi', 'Soft Sci-Fi', 'Dystopian', 'Post-Apocalyptic'],
    keywords: ['future', 'space', 'technology', 'AI', 'robot', 'galaxy', 'planet', 'spacecraft', 'alien', 'FTL']
  },
  'Fantasy': {
    subGenres: ['High Fantasy', 'Urban Fantasy', 'Dark Fantasy', 'Epic Fantasy', 'Sword & Sorcery'],
    keywords: ['magic', 'dragon', 'wizard', 'sword', 'kingdom', 'quest', 'elf', 'dwarf', 'sorcery', 'mythical']
  },
  'Mystery': {
    subGenres: ['Detective', 'Thriller', 'Noir', 'Police Procedural', 'Cozy Mystery', 'True Crime'],
    keywords: ['murder', 'detective', 'investigation', 'clue', 'suspect', 'evidence', 'crime', 'killer', 'whodunit']
  },
  'Romance': {
    subGenres: ['Contemporary Romance', 'Historical Romance', 'Paranormal Romance', 'Romantic Suspense'],
    keywords: ['love', 'relationship', 'marriage', 'passion', 'heart', 'romance', 'wedding', 'affair']
  },
  'Horror': {
    subGenres: ['Gothic Horror', 'Slasher', 'Psychological Horror', 'Supernatural Horror', 'Cosmic Horror'],
    keywords: ['scary', 'ghost', 'monster', 'demon', 'haunted', 'creepy', 'terror', 'blood', 'evil']
  },
  'Historical': {
    subGenres: ['Historical Fiction', 'Historical Fantasy', 'Alternate History', 'Historical Romance'],
    keywords: ['war', 'king', 'queen', 'empire', 'ancient', 'medieval', 'victorian', 'century', 'battle']
  },
  'Thriller': {
    subGenres: ['Psychological Thriller', 'Action Thriller', 'Legal Thriller', 'Medical Thriller', 'Spy Thriller'],
    keywords: ['suspense', 'danger', 'chase', 'conspiracy', 'assassin', 'kidnap', 'escape', 'hostage']
  },
  'Biography': {
    subGenres: ['Memoir', 'Autobiography', 'Biography', 'Journal'],
    keywords: ['life', 'story', 'memoir', 'biography', 'autobiography', 'personal', 'experience']
  },
  'Self-Help': {
    subGenres: ['Personal Development', 'Motivation', 'Business', 'Health & Wellness', 'Spirituality'],
    keywords: ['success', 'growth', 'improve', 'habit', 'mindset', 'productivity', 'goal', 'achieve']
  },
  'Business': {
    subGenres: ['Leadership', 'Management', 'Entrepreneurship', 'Finance', 'Marketing'],
    keywords: ['company', 'money', 'profit', 'leadership', 'strategy', 'market', 'investment', 'career']
  }
};

// Theme Database
const THEME_DATABASE = {
  'Technology & AI': {
    keywords: ['AI', 'robot', 'computer', 'cyber', 'digital', 'virtual', 'automation', 'algorithm', 'tech'],
    weight: 1.0
  },
  'Space Exploration': {
    keywords: ['space', 'galaxy', 'planet', 'star', 'universe', 'astronaut', 'rocket', 'cosmos', 'alien'],
    weight: 1.0
  },
  'War & Conflict': {
    keywords: ['war', 'battle', 'military', 'soldier', 'fight', 'conflict', 'army', 'weapon', 'combat'],
    weight: 1.0
  },
  'Love & Relationships': {
    keywords: ['love', 'romance', 'relationship', 'marriage', 'heart', 'passion', 'dating', 'marriage'],
    weight: 1.0
  },
  'Identity & Self-Discovery': {
    keywords: ['identity', 'self', 'discovery', 'growth', 'transformation', 'becoming', 'finding yourself'],
    weight: 1.0
  },
  'Power & Politics': {
    keywords: ['power', 'politics', 'government', 'control', 'authority', 'politician', 'regime', 'revolution'],
    weight: 1.0
  },
  'Survival': {
    keywords: ['survival', 'apocalypse', 'disaster', 'danger', 'escape', 'wilderness', 'end of world'],
    weight: 1.0
  },
  'Morality & Ethics': {
    keywords: ['morality', 'ethics', 'right', 'wrong', 'choice', 'sacrifice', 'justice', 'evil', 'good'],
    weight: 1.0
  },
  'Friendship & Loyalty': {
    keywords: ['friendship', 'loyalty', 'trust', 'betrayal', 'companion', 'team', 'ally', 'bond'],
    weight: 1.0
  },
  'Family & Generations': {
    keywords: ['family', 'father', 'mother', 'son', 'daughter', 'generations', 'legacy', 'ancestry'],
    weight: 1.0
  }
};

/**
 * Hauptklasse für Genre/Theme-Analyse
 */
class GenreAnalyzer {
  constructor(options = {}) {
    this.genreDb = GENRE_DATABASE;
    this.themeDb = THEME_DATABASE;
    this.minConfidence = options.minConfidence || 0.3;
  }

  /**
   * Analysiere ein einzelnes Buch
   */
  analyzeBook(book) {
    const text = this.getBookText(book);
    
    return {
      title: book.title,
      author: book.author,
      genres: this.extractGenres(text, book.genre),
      themes: this.extractThemes(text),
      subGenres: this.extractSubGenres(text),
      confidence: this.calculateConfidence(book)
    };
  }

  /**
   * Analysiere mehrere Bücher
   */
  analyzeBooks(books) {
    return books.map(book => this.analyzeBook(book));
  }

  /**
   * Extrahiere Genres aus Text
   */
  extractGenres(text, fallbackGenre = null) {
    const scores = {};
    const lowerText = text.toLowerCase();
    
    for (const [genre, data] of Object.entries(this.genreDb)) {
      let score = 0;
      
      // Keyword matches
      for (const keyword of data.keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          score += 1;
        }
      }
      
      // Normalize score
      if (data.keywords.length > 0) {
        scores[genre] = score / data.keywords.length;
      }
    }
    
    // Sort by score
    const sorted = Object.entries(scores)
      .filter(([_, score]) => score >= this.minConfidence)
      .sort((a, b) => b[1] - a[1]);
    
    // Add fallback genre if no matches
    if (sorted.length === 0 && fallbackGenre) {
      return [fallbackGenre];
    }
    
    return sorted.slice(0, 3).map(([genre]) => genre);
  }

  /**
   * Extrahiere Themen aus Text
   */
  extractThemes(text) {
    const scores = {};
    const lowerText = text.toLowerCase();
    
    for (const [theme, data] of Object.entries(this.themeDb)) {
      let score = 0;
      
      for (const keyword of data.keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          score += data.weight;
        }
      }
      
      if (data.keywords.length > 0) {
        scores[theme] = score / data.keywords.length;
      }
    }
    
    return Object.entries(scores)
      .filter(([_, score]) => score >= this.minConfidence)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theme]) => theme);
  }

  /**
   * Extrahiere Sub-Genres
   */
  extractSubGenres(text) {
    const subGenres = [];
    const lowerText = text.toLowerCase();
    
    for (const [, data] of Object.entries(this.genreDb)) {
      for (const subGenre of data.subGenres || []) {
        if (lowerText.includes(subGenre.toLowerCase())) {
          subGenres.push(subGenre);
        }
      }
    }
    
    return subGenres;
  }

  /**
   * Berechne Konfidenz der Analyse
   */
  calculateConfidence(book) {
    const text = this.getBookText(book);
    const genres = this.extractGenres(text);
    const themes = this.extractThemes(text);
    
    // Confidence basierend auf gefundenen Matches
    const genreConfidence = Math.min(genres.length / 3, 1) * 0.5;
    const themeConfidence = Math.min(themes.length / 5, 1) * 0.5;
    
    return Math.round((genreConfidence + themeConfidence) * 100) / 100;
  }

  /**
   * Kombiniere Text aus Buch-Objekt
   */
  getBookText(book) {
    return `${book.title} ${book.author} ${book.genre || ''} ${(book.themes || []).join(' ')} ${book.description || ''}`;
  }

  /**
   * Analysiere Genre-Präferenzen eines Users
   */
  analyzeUserPreferences(books) {
    const genreCounts = {};
    const themeCounts = {};
    const ratingWeightedGenres = {};
    const ratingWeightedThemes = {};
    
    for (const book of books) {
      const genres = this.extractGenres(this.getBookText(book), book.genre);
      const themes = this.extractThemes(this.getBookText(book));
      const rating = book.rating || 5;
      
      for (const genre of genres) {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        ratingWeightedGenres[genre] = (ratingWeightedGenres[genre] || 0) + rating;
      }
      
      for (const theme of themes) {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
        ratingWeightedThemes[theme] = (ratingWeightedThemes[theme] || 0) + rating;
      }
    }
    
    return {
      topGenres: this.sortByValue(ratingWeightedGenres).slice(0, 5),
      topThemes: this.sortByValue(ratingWeightedThemes).slice(0, 5),
      genreDistribution: genreCounts,
      themeDistribution: themeCounts
    };
  }

  /**
   * Hilfsmethode: Sortiere nach Wert
   */
  sortByValue(obj) {
    return Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }
}

/**
 * CLI-Funktion für direkte Analyse
 */
function analyzeFromCLI() {
  const args = process.argv.slice(2);
  const filePath = args[2] || path.join(__dirname, '..', 'data', 'books.json');
  
  try {
    const books = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const analyzer = new GenreAnalyzer();
    
    console.log('\n📊 Genre/Theme Analyse\n');
    
    // User Preferences
    const prefs = analyzer.analyzeUserPreferences(books);
    console.log('Deine Top Genres:');
    prefs.topGenres.forEach((g, i) => console.log(`  ${i + 1}. ${g.name} (Score: ${g.value.toFixed(1)})`));
    
    console.log('\nDeine Top Themen:');
    prefs.topThemes.forEach((t, i) => console.log(`  ${i + 1}. ${t.name} (Score: ${t.value.toFixed(1)})`));
    
    console.log('\n📚 Buch-Analyse:');
    const analyzed = analyzer.analyzeBooks(books.slice(0, 5));
    analyzed.forEach(book => {
      console.log(`\n"${book.title}"`);
      console.log(`  Genres: ${book.genres.join(', ')}`);
      console.log(`  Themen: ${book.themes.join(', ')}`);
      console.log(`  Confidence: ${(book.confidence * 100).toFixed(0)}%`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

module.exports = {
  GenreAnalyzer,
  GENRE_DATABASE,
  THEME_DATABASE
};

// Run if called directly
if (require.main === module) {
  analyzeFromCLI();
}
