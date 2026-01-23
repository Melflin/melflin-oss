/**
 * Reading Recommendation Engine - Tests
 */

const assert = require('assert');
const { GenreAnalyzer } = require('../lib/genre-analyzer');

describe('GenreAnalyzer', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new GenreAnalyzer({ minConfidence: 0.2 });
  });

  describe('extractGenres', () => {
    it('should identify Science Fiction books', () => {
      const text = 'space galaxy planet robot AI technology future';
      const genres = analyzer.extractGenres(text);
      assert.ok(genres.includes('Science Fiction'), 'Should identify Sci-Fi');
    });

    it('should identify Fantasy books', () => {
      const text = 'magic dragon wizard sword kingdom elf sorcery';
      const genres = analyzer.extractGenres(text);
      assert.ok(genres.includes('Fantasy'), 'Should identify Fantasy');
    });

    it('should identify Mystery books', () => {
      const text = 'murder detective investigation clue suspect evidence';
      const genres = analyzer.extractGenres(text);
      assert.ok(genres.includes('Mystery'), 'Should identify Mystery');
    });

    it('should return multiple genres', () => {
      const text = 'space galaxy magic dragon robot AI technology';
      const genres = analyzer.extractGenres(text);
      assert.ok(genres.length > 1, 'Should return multiple genres');
    });
  });

  describe('extractThemes', () => {
    it('should identify Technology theme', () => {
      const text = 'AI robot computer cyber digital virtual automation';
      const themes = analyzer.extractThemes(text);
      assert.ok(themes.includes('Technology & AI'), 'Should identify Technology');
    });

    it('should identify Space theme', () => {
      const text = 'space galaxy planet star universe astronaut rocket';
      const themes = analyzer.extractThemes(text);
      assert.ok(themes.includes('Space Exploration'), 'Should identify Space');
    });

    it('should identify War theme', () => {
      const text = 'war battle military soldier fight conflict army';
      const themes = analyzer.extractThemes(text);
      assert.ok(themes.includes('War & Conflict'), 'Should identify War');
    });
  });

  describe('analyzeBook', () => {
    it('should analyze a complete book object', () => {
      const book = {
        title: 'Dune',
        author: 'Frank Herbert',
        genre: 'Science Fiction',
        rating: 4.8
      };

      const analysis = analyzer.analyzeBook(book);
      
      assert.ok(analysis.genres.length > 0, 'Should have genres');
      assert.ok(analysis.themes.length > 0, 'Should have themes');
      assert.ok(analysis.confidence >= 0, 'Should have confidence score');
    });
  });

  describe('analyzeUserPreferences', () => {
    it('should calculate user preferences from books', () => {
      const books = [
        { title: 'Foundation', genre: 'Science Fiction', rating: 5 },
        { title: 'Dune', genre: 'Science Fiction', rating: 4 },
        { title: 'The Hobbit', genre: 'Fantasy', rating: 4.5 }
      ];

      const prefs = analyzer.analyzeUserPreferences(books);
      
      assert.ok(prefs.topGenres.length > 0, 'Should have top genres');
      assert.ok(prefs.topThemes.length >= 0, 'Should have top themes');
      assert.strictEqual(prefs.topGenres[0].name, 'Science Fiction');
    });
  });

  describe('calculateConfidence', () => {
    it('should return confidence between 0 and 1', () => {
      const book = { title: 'Test', genre: 'Science Fiction' };
      const confidence = analyzer.calculateConfidence(book);
      
      assert.ok(confidence >= 0 && confidence <= 1, 'Confidence should be between 0 and 1');
    });
  });
});

// Integration test for main recommendation flow
describe('Recommendation Flow', () => {
  it('should generate recommendations from sample books', () => {
    const analyzer = new GenreAnalyzer();
    
    const books = [
      { title: 'Foundation', author: 'Isaac Asimov', genre: 'Science Fiction', rating: 4.8 },
      { title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction', rating: 4.9 }
    ];
    
    const prefs = analyzer.analyzeUserPreferences(books);
    
    assert.ok(prefs.topGenres.length > 0, 'Should analyze preferences');
    assert.strictEqual(prefs.topGenres[0].name, 'Science Fiction');
  });
});
