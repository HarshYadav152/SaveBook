/**
 * Advanced Note Helpers for SaveBook
 * Comprehensive utilities for note manipulation, search, export,
 * formatting, versioning, and content analysis.
 * 
 * Author: ayushap18
 * Date: January 2026
 * ECWoC 2026 Contribution
 */

// ============================================================
// NOTE FORMATTING UTILITIES
// ============================================================

/**
 * Formats note content to plain text
 * @param {string} content - HTML or markdown content
 * @returns {string} Plain text content
 */
export const toPlainText = (content) => {
  if (!content) return '';
  
  return content
    // Remove HTML tags
    .replace(/<[^>]+>/g, ' ')
    // Remove markdown headers
    .replace(/#{1,6}\s/g, '')
    // Remove markdown bold/italic
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    // Remove markdown links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove markdown code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown blockquotes
    .replace(/^\s*>\s*/gm, '')
    // Remove markdown lists
    .replace(/^\s*[-*+]\s/gm, '')
    .replace(/^\s*\d+\.\s/gm, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Formats note content to HTML
 * @param {string} content - Markdown content
 * @returns {string} HTML content
 */
export const markdownToHTML = (content) => {
  if (!content) return '';
  
  let html = content;
  
  // Escape HTML entities first
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Headers
  html = html.replace(/^######\s(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s(.+)$/gm, '<h1>$1</h1>');
  
  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
  
  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const langClass = lang ? ` class="language-${lang}"` : '';
    return `<pre><code${langClass}>${code.trim()}</code></pre>`;
  });
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  
  // Blockquotes
  html = html.replace(/^\s*&gt;\s(.+)$/gm, '<blockquote>$1</blockquote>');
  
  // Unordered lists
  html = html.replace(/^\s*[-*+]\s(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // Ordered lists
  html = html.replace(/^\s*\d+\.\s(.+)$/gm, '<li>$1</li>');
  
  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr>');
  html = html.replace(/^\*\*\*+$/gm, '<hr>');
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  
  // Wrap in paragraph
  html = `<p>${html}</p>`;
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  html = html.replace(/<p>(<hr>)<\/p>/g, '$1');
  
  return html;
};

/**
 * Converts HTML to Markdown
 * @param {string} html - HTML content
 * @returns {string} Markdown content
 */
export const htmlToMarkdown = (html) => {
  if (!html) return '';
  
  let md = html;
  
  // Headers
  md = md.replace(/<h1[^>]*>([^<]+)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2[^>]*>([^<]+)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3[^>]*>([^<]+)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<h4[^>]*>([^<]+)<\/h4>/gi, '#### $1\n\n');
  md = md.replace(/<h5[^>]*>([^<]+)<\/h5>/gi, '##### $1\n\n');
  md = md.replace(/<h6[^>]*>([^<]+)<\/h6>/gi, '###### $1\n\n');
  
  // Bold and italic
  md = md.replace(/<strong><em>([^<]+)<\/em><\/strong>/gi, '***$1***');
  md = md.replace(/<em><strong>([^<]+)<\/strong><\/em>/gi, '***$1***');
  md = md.replace(/<strong[^>]*>([^<]+)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>([^<]+)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>([^<]+)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>([^<]+)<\/i>/gi, '*$1*');
  
  // Strikethrough
  md = md.replace(/<del[^>]*>([^<]+)<\/del>/gi, '~~$1~~');
  md = md.replace(/<s[^>]*>([^<]+)<\/s>/gi, '~~$1~~');
  
  // Code blocks
  md = md.replace(/<pre[^>]*><code[^>]*class="language-(\w+)"[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```$1\n$2\n```\n\n');
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n');
  md = md.replace(/<code[^>]*>([^<]+)<\/code>/gi, '`$1`');
  
  // Links
  md = md.replace(/<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi, '[$2]($1)');
  
  // Images
  md = md.replace(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]+)"[^>]*>/gi, '![$1]($2)');
  md = md.replace(/<img[^>]*src="([^"]+)"[^>]*>/gi, '![]($1)');
  
  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (match, content) => {
    return content.split('\n').map(line => `> ${line}`).join('\n') + '\n\n';
  });
  
  // Lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, '$1\n');
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
    let counter = 0;
    return content.replace(/<li[^>]*>([^<]*)<\/li>/gi, () => {
      counter++;
      return `${counter}. `;
    }) + '\n';
  });
  md = md.replace(/<li[^>]*>([^<]*)<\/li>/gi, '- $1\n');
  
  // Horizontal rules
  md = md.replace(/<hr[^>]*>/gi, '\n---\n\n');
  
  // Paragraphs and line breaks
  md = md.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n');
  md = md.replace(/<p[^>]*>/gi, '');
  md = md.replace(/<\/p>/gi, '\n\n');
  md = md.replace(/<br[^>]*>/gi, '\n');
  
  // Remove remaining tags
  md = md.replace(/<[^>]+>/g, '');
  
  // Decode HTML entities
  md = md
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  
  // Clean up whitespace
  md = md.replace(/\n{3,}/g, '\n\n').trim();
  
  return md;
};

// ============================================================
// NOTE SEARCH UTILITIES
// ============================================================

/**
 * Searches notes with various options
 * @param {Array} notes - Array of note objects
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Array} Matching notes
 */
export const searchNotes = (notes, query, options = {}) => {
  if (!notes || !Array.isArray(notes)) return [];
  if (!query || !query.trim()) return notes;
  
  const {
    fields = ['title', 'content', 'tags'],
    caseSensitive = false,
    exactMatch = false,
    fuzzy = false,
    limit = 0
  } = options;
  
  const searchTerms = caseSensitive ? query.trim() : query.trim().toLowerCase();
  
  let results = notes.filter(note => {
    for (const field of fields) {
      let value = note[field];
      
      if (Array.isArray(value)) {
        value = value.join(' ');
      }
      
      if (!value) continue;
      
      const searchValue = caseSensitive ? value : value.toLowerCase();
      
      if (exactMatch) {
        if (searchValue === searchTerms) return true;
      } else if (fuzzy) {
        if (fuzzyMatch(searchValue, searchTerms)) return true;
      } else {
        if (searchValue.includes(searchTerms)) return true;
      }
    }
    return false;
  });
  
  // Score and sort by relevance
  results = results.map(note => ({
    ...note,
    _searchScore: calculateSearchScore(note, searchTerms, fields, caseSensitive)
  })).sort((a, b) => b._searchScore - a._searchScore);
  
  if (limit > 0) {
    results = results.slice(0, limit);
  }
  
  return results;
};

/**
 * Fuzzy matching algorithm
 * @param {string} text - Text to search in
 * @param {string} query - Query to find
 * @returns {boolean} Whether query fuzzy matches text
 */
export const fuzzyMatch = (text, query) => {
  if (!text || !query) return false;
  
  let textIndex = 0;
  let queryIndex = 0;
  
  while (textIndex < text.length && queryIndex < query.length) {
    if (text[textIndex] === query[queryIndex]) {
      queryIndex++;
    }
    textIndex++;
  }
  
  return queryIndex === query.length;
};

/**
 * Calculates search relevance score
 * @param {Object} note - Note object
 * @param {string} query - Search query
 * @param {Array} fields - Fields to search
 * @param {boolean} caseSensitive - Case sensitivity
 * @returns {number} Relevance score
 */
const calculateSearchScore = (note, query, fields, caseSensitive) => {
  let score = 0;
  const fieldWeights = {
    title: 10,
    tags: 5,
    content: 1
  };
  
  for (const field of fields) {
    let value = note[field];
    
    if (Array.isArray(value)) {
      value = value.join(' ');
    }
    
    if (!value) continue;
    
    const searchValue = caseSensitive ? value : value.toLowerCase();
    const weight = fieldWeights[field] || 1;
    
    // Exact match bonus
    if (searchValue === query) {
      score += 100 * weight;
    }
    
    // Starts with bonus
    if (searchValue.startsWith(query)) {
      score += 50 * weight;
    }
    
    // Count occurrences
    const regex = new RegExp(escapeRegex(query), caseSensitive ? 'g' : 'gi');
    const matches = value.match(regex);
    if (matches) {
      score += matches.length * weight;
    }
    
    // Word boundary match bonus
    const wordBoundaryRegex = new RegExp(`\\b${escapeRegex(query)}\\b`, caseSensitive ? 'g' : 'gi');
    const wordMatches = value.match(wordBoundaryRegex);
    if (wordMatches) {
      score += wordMatches.length * 5 * weight;
    }
  }
  
  return score;
};

/**
 * Escapes regex special characters
 * @param {string} string - String to escape
 * @returns {string} Escaped string
 */
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Highlights search matches in text
 * @param {string} text - Text to highlight
 * @param {string} query - Search query
 * @param {string} highlightTag - HTML tag for highlighting
 * @returns {string} Text with highlights
 */
export const highlightMatches = (text, query, highlightTag = 'mark') => {
  if (!text || !query) return text;
  
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, `<${highlightTag}>$1</${highlightTag}>`);
};

// ============================================================
// NOTE EXPORT UTILITIES
// ============================================================

/**
 * Exports notes to various formats
 */
export const NoteExporter = {
  /**
   * Exports note to JSON
   * @param {Object|Array} notes - Note(s) to export
   * @returns {string} JSON string
   */
  toJSON(notes) {
    const data = Array.isArray(notes) ? notes : [notes];
    return JSON.stringify(data, null, 2);
  },
  
  /**
   * Exports note to Markdown
   * @param {Object} note - Note to export
   * @returns {string} Markdown content
   */
  toMarkdown(note) {
    if (!note) return '';
    
    let md = '';
    
    // Title
    md += `# ${note.title || 'Untitled'}\n\n`;
    
    // Metadata
    if (note.createdAt) {
      md += `*Created: ${formatDate(note.createdAt)}*\n`;
    }
    if (note.updatedAt) {
      md += `*Updated: ${formatDate(note.updatedAt)}*\n`;
    }
    if (note.tags && note.tags.length > 0) {
      md += `*Tags: ${note.tags.join(', ')}*\n`;
    }
    
    md += '\n---\n\n';
    
    // Content
    md += note.content || '';
    
    return md;
  },
  
  /**
   * Exports notes to CSV
   * @param {Array} notes - Notes to export
   * @returns {string} CSV content
   */
  toCSV(notes) {
    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return 'title,content,tags,created_at,updated_at\n';
    }
    
    const escapeCSV = (value) => {
      if (!value) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    const headers = ['title', 'content', 'tags', 'created_at', 'updated_at'];
    let csv = headers.join(',') + '\n';
    
    for (const note of notes) {
      const row = [
        escapeCSV(note.title),
        escapeCSV(toPlainText(note.content)),
        escapeCSV(Array.isArray(note.tags) ? note.tags.join(';') : ''),
        escapeCSV(note.createdAt),
        escapeCSV(note.updatedAt)
      ];
      csv += row.join(',') + '\n';
    }
    
    return csv;
  },
  
  /**
   * Exports notes to HTML
   * @param {Array|Object} notes - Note(s) to export
   * @returns {string} HTML content
   */
  toHTML(notes) {
    const noteArray = Array.isArray(notes) ? notes : [notes];
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SaveBook Export</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .note { margin-bottom: 40px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; }
    .note-title { margin: 0 0 10px 0; color: #333; }
    .note-meta { font-size: 12px; color: #666; margin-bottom: 15px; }
    .note-tags { margin-top: 15px; }
    .note-tag { display: inline-block; background: #e3f2fd; color: #1976d2; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px; }
    .note-content { line-height: 1.6; }
    hr { border: none; border-top: 1px solid #e0e0e0; margin: 15px 0; }
  </style>
</head>
<body>
  <h1>SaveBook Export</h1>
  <p>Exported on ${formatDate(new Date())}</p>
  <hr>
`;
    
    for (const note of noteArray) {
      html += `
  <div class="note">
    <h2 class="note-title">${escapeHTML(note.title || 'Untitled')}</h2>
    <div class="note-meta">
      ${note.createdAt ? `Created: ${formatDate(note.createdAt)}` : ''}
      ${note.updatedAt ? ` | Updated: ${formatDate(note.updatedAt)}` : ''}
    </div>
    <div class="note-content">
      ${markdownToHTML(note.content || '')}
    </div>
    ${note.tags && note.tags.length > 0 ? `
    <div class="note-tags">
      ${note.tags.map(tag => `<span class="note-tag">${escapeHTML(tag)}</span>`).join('')}
    </div>
    ` : ''}
  </div>
`;
    }
    
    html += `
</body>
</html>`;
    
    return html;
  },
  
  /**
   * Exports notes to plain text
   * @param {Array|Object} notes - Note(s) to export
   * @returns {string} Plain text content
   */
  toPlainText(notes) {
    const noteArray = Array.isArray(notes) ? notes : [notes];
    
    return noteArray.map(note => {
      let text = '';
      text += `${note.title || 'Untitled'}\n`;
      text += '='.repeat((note.title || 'Untitled').length) + '\n\n';
      
      if (note.createdAt) {
        text += `Created: ${formatDate(note.createdAt)}\n`;
      }
      if (note.tags && note.tags.length > 0) {
        text += `Tags: ${note.tags.join(', ')}\n`;
      }
      
      text += '\n' + toPlainText(note.content || '') + '\n';
      text += '\n' + '-'.repeat(50) + '\n\n';
      
      return text;
    }).join('');
  }
};

// ============================================================
// NOTE VERSIONING
// ============================================================

/**
 * Note version manager
 */
export class NoteVersionManager {
  constructor(maxVersions = 50) {
    this.maxVersions = maxVersions;
    this.versions = new Map();
  }
  
  /**
   * Creates a new version
   * @param {string} noteId - Note ID
   * @param {Object} content - Note content
   * @param {string} author - Author ID
   * @returns {Object} Version info
   */
  createVersion(noteId, content, author = null) {
    if (!this.versions.has(noteId)) {
      this.versions.set(noteId, []);
    }
    
    const noteVersions = this.versions.get(noteId);
    const versionNumber = noteVersions.length + 1;
    
    const version = {
      versionNumber,
      noteId,
      content: JSON.parse(JSON.stringify(content)),
      author,
      timestamp: new Date().toISOString(),
      hash: this.hashContent(content)
    };
    
    noteVersions.push(version);
    
    // Trim old versions
    if (noteVersions.length > this.maxVersions) {
      noteVersions.shift();
    }
    
    return version;
  }
  
  /**
   * Gets all versions for a note
   * @param {string} noteId - Note ID
   * @returns {Array} Versions
   */
  getVersions(noteId) {
    return this.versions.get(noteId) || [];
  }
  
  /**
   * Gets a specific version
   * @param {string} noteId - Note ID
   * @param {number} versionNumber - Version number
   * @returns {Object|null} Version or null
   */
  getVersion(noteId, versionNumber) {
    const versions = this.getVersions(noteId);
    return versions.find(v => v.versionNumber === versionNumber) || null;
  }
  
  /**
   * Gets the latest version
   * @param {string} noteId - Note ID
   * @returns {Object|null} Latest version or null
   */
  getLatestVersion(noteId) {
    const versions = this.getVersions(noteId);
    return versions.length > 0 ? versions[versions.length - 1] : null;
  }
  
  /**
   * Compares two versions
   * @param {string} noteId - Note ID
   * @param {number} v1 - First version number
   * @param {number} v2 - Second version number
   * @returns {Object} Comparison result
   */
  compareVersions(noteId, v1, v2) {
    const version1 = this.getVersion(noteId, v1);
    const version2 = this.getVersion(noteId, v2);
    
    if (!version1 || !version2) {
      return { error: 'Version not found' };
    }
    
    return {
      v1: version1,
      v2: version2,
      titleChanged: version1.content.title !== version2.content.title,
      contentChanged: version1.hash !== version2.hash,
      tagsChanged: JSON.stringify(version1.content.tags) !== JSON.stringify(version2.content.tags),
      diff: this.generateDiff(version1.content, version2.content)
    };
  }
  
  /**
   * Restores a version
   * @param {string} noteId - Note ID
   * @param {number} versionNumber - Version to restore
   * @returns {Object} Restored content
   */
  restoreVersion(noteId, versionNumber) {
    const version = this.getVersion(noteId, versionNumber);
    if (!version) {
      return { error: 'Version not found' };
    }
    
    return {
      success: true,
      content: JSON.parse(JSON.stringify(version.content)),
      restoredFrom: versionNumber
    };
  }
  
  /**
   * Hashes content for comparison
   * @param {Object} content - Content to hash
   * @returns {string} Hash
   */
  hashContent(content) {
    const str = JSON.stringify(content);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }
  
  /**
   * Generates diff between contents
   * @param {Object} old - Old content
   * @param {Object} newer - New content
   * @returns {Object} Diff
   */
  generateDiff(old, newer) {
    const diff = {
      title: old.title !== newer.title ? { old: old.title, new: newer.title } : null,
      content: old.content !== newer.content ? { changed: true } : null,
      tags: {
        added: (newer.tags || []).filter(t => !(old.tags || []).includes(t)),
        removed: (old.tags || []).filter(t => !(newer.tags || []).includes(t))
      }
    };
    
    return diff;
  }
  
  /**
   * Clears versions for a note
   * @param {string} noteId - Note ID
   */
  clearVersions(noteId) {
    this.versions.delete(noteId);
  }
}

// ============================================================
// CONTENT ANALYSIS
// ============================================================

/**
 * Analyzes note content
 * @param {Object} note - Note to analyze
 * @returns {Object} Analysis results
 */
export const analyzeNote = (note) => {
  if (!note) return null;
  
  const plainContent = toPlainText(note.content || '');
  const words = plainContent.split(/\s+/).filter(w => w.length > 0);
  const sentences = plainContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = (note.content || '').split(/\n\n+/).filter(p => p.trim().length > 0);
  
  // Word frequency
  const wordFrequency = {};
  words.forEach(word => {
    const normalized = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalized.length > 2) {
      wordFrequency[normalized] = (wordFrequency[normalized] || 0) + 1;
    }
  });
  
  // Top words (excluding common stop words)
  const stopWords = new Set(['the', 'and', 'but', 'for', 'are', 'with', 'this', 'that', 'was', 'have', 'has', 'had', 'been', 'will', 'would', 'could', 'should', 'from', 'they', 'their', 'them', 'what', 'which', 'when', 'where', 'who', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same', 'than', 'too', 'very', 'can', 'just', 'into', 'also', 'your', 'you']);
  
  const topWords = Object.entries(wordFrequency)
    .filter(([word]) => !stopWords.has(word))
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
  
  // Reading metrics
  const avgWordLength = words.length > 0 
    ? words.reduce((sum, w) => sum + w.length, 0) / words.length 
    : 0;
  
  const avgSentenceLength = sentences.length > 0 
    ? words.length / sentences.length 
    : 0;
  
  // Readability score (Flesch Reading Ease approximation)
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
  const fleschScore = sentences.length > 0 && words.length > 0
    ? 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllables / words.length)
    : 0;
  
  // Estimated reading time (average 200 words per minute)
  const readingTimeMinutes = Math.ceil(words.length / 200);
  
  return {
    title: note.title || 'Untitled',
    statistics: {
      characters: plainContent.length,
      charactersNoSpaces: plainContent.replace(/\s/g, '').length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      avgWordLength: Math.round(avgWordLength * 10) / 10,
      avgSentenceLength: Math.round(avgSentenceLength * 10) / 10
    },
    readability: {
      fleschScore: Math.round(fleschScore),
      level: getReadabilityLevel(fleschScore),
      readingTime: `${readingTimeMinutes} min`
    },
    keywords: topWords.map(([word, count]) => ({ word, count })),
    tags: note.tags || [],
    hasCode: /```/.test(note.content || ''),
    hasLinks: /\[.*\]\(.*\)/.test(note.content || ''),
    hasImages: /!\[.*\]\(.*\)/.test(note.content || ''),
    hasTables: /\|.*\|/.test(note.content || '')
  };
};

/**
 * Counts syllables in a word (approximate)
 * @param {string} word - Word to count
 * @returns {number} Syllable count
 */
const countSyllables = (word) => {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
};

/**
 * Gets readability level from Flesch score
 * @param {number} score - Flesch score
 * @returns {string} Readability level
 */
const getReadabilityLevel = (score) => {
  if (score >= 90) return 'Very Easy';
  if (score >= 80) return 'Easy';
  if (score >= 70) return 'Fairly Easy';
  if (score >= 60) return 'Standard';
  if (score >= 50) return 'Fairly Difficult';
  if (score >= 30) return 'Difficult';
  return 'Very Difficult';
};

// ============================================================
// NOTE SORTING AND FILTERING
// ============================================================

/**
 * Sorts notes by various criteria
 * @param {Array} notes - Notes to sort
 * @param {string} sortBy - Sort criteria
 * @param {string} order - Sort order (asc/desc)
 * @returns {Array} Sorted notes
 */
export const sortNotes = (notes, sortBy = 'updatedAt', order = 'desc') => {
  if (!notes || !Array.isArray(notes)) return [];
  
  const sorted = [...notes].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'title':
        valueA = (a.title || '').toLowerCase();
        valueB = (b.title || '').toLowerCase();
        return valueA.localeCompare(valueB);
        
      case 'createdAt':
      case 'updatedAt':
        valueA = new Date(a[sortBy] || 0).getTime();
        valueB = new Date(b[sortBy] || 0).getTime();
        return valueA - valueB;
        
      case 'contentLength':
        valueA = (a.content || '').length;
        valueB = (b.content || '').length;
        return valueA - valueB;
        
      case 'wordCount':
        valueA = toPlainText(a.content || '').split(/\s+/).length;
        valueB = toPlainText(b.content || '').split(/\s+/).length;
        return valueA - valueB;
        
      default:
        return 0;
    }
  });
  
  return order === 'desc' ? sorted.reverse() : sorted;
};

/**
 * Filters notes by criteria
 * @param {Array} notes - Notes to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered notes
 */
export const filterNotes = (notes, filters = {}) => {
  if (!notes || !Array.isArray(notes)) return [];
  
  return notes.filter(note => {
    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      const noteTags = note.tags || [];
      const hasAllTags = filters.tags.every(tag => noteTags.includes(tag));
      if (!hasAllTags) return false;
    }
    
    // Filter by any tag
    if (filters.anyTag && filters.anyTag.length > 0) {
      const noteTags = note.tags || [];
      const hasAnyTag = filters.anyTag.some(tag => noteTags.includes(tag));
      if (!hasAnyTag) return false;
    }
    
    // Filter by date range
    if (filters.dateFrom) {
      const noteDate = new Date(note.createdAt || note.updatedAt);
      if (noteDate < new Date(filters.dateFrom)) return false;
    }
    
    if (filters.dateTo) {
      const noteDate = new Date(note.createdAt || note.updatedAt);
      if (noteDate > new Date(filters.dateTo)) return false;
    }
    
    // Filter by folder
    if (filters.folderId) {
      if (note.folderId !== filters.folderId) return false;
    }
    
    // Filter by favorite
    if (filters.favorite !== undefined) {
      if (note.favorite !== filters.favorite) return false;
    }
    
    // Filter by archived
    if (filters.archived !== undefined) {
      if (note.archived !== filters.archived) return false;
    }
    
    // Filter by pinned
    if (filters.pinned !== undefined) {
      if (note.pinned !== filters.pinned) return false;
    }
    
    // Filter by color
    if (filters.color) {
      if (note.color !== filters.color) return false;
    }
    
    // Filter by content type
    if (filters.hasCode !== undefined) {
      const hasCode = /```/.test(note.content || '');
      if (hasCode !== filters.hasCode) return false;
    }
    
    if (filters.hasImages !== undefined) {
      const hasImages = /!\[.*\]\(.*\)/.test(note.content || '');
      if (hasImages !== filters.hasImages) return false;
    }
    
    // Filter by word count
    if (filters.minWords) {
      const wordCount = toPlainText(note.content || '').split(/\s+/).length;
      if (wordCount < filters.minWords) return false;
    }
    
    if (filters.maxWords) {
      const wordCount = toPlainText(note.content || '').split(/\s+/).length;
      if (wordCount > filters.maxWords) return false;
    }
    
    return true;
  });
};

// ============================================================
// NOTE TEMPLATES
// ============================================================

/**
 * Predefined note templates
 */
export const noteTemplates = {
  /**
   * Blank note
   */
  blank: {
    title: '',
    content: '',
    tags: []
  },
  
  /**
   * Meeting notes template
   */
  meeting: {
    title: 'Meeting Notes - [Date]',
    content: `## Meeting Details
- **Date:** 
- **Time:** 
- **Attendees:** 

## Agenda
1. 
2. 
3. 

## Discussion Points


## Action Items
- [ ] 
- [ ] 
- [ ] 

## Next Steps


## Notes

`,
    tags: ['meeting', 'notes']
  },
  
  /**
   * Project plan template
   */
  project: {
    title: 'Project: [Project Name]',
    content: `## Project Overview


## Objectives
1. 
2. 
3. 

## Timeline
| Phase | Start | End | Status |
|-------|-------|-----|--------|
| Planning | | | |
| Development | | | |
| Testing | | | |
| Launch | | | |

## Resources
- 

## Risks & Mitigation


## Success Metrics


## Notes

`,
    tags: ['project', 'planning']
  },
  
  /**
   * Daily journal template
   */
  journal: {
    title: 'Journal - [Date]',
    content: `## Today's Focus


## What I Accomplished
- 

## Challenges


## Gratitude
1. 
2. 
3. 

## Tomorrow's Goals
- 

## Reflection

`,
    tags: ['journal', 'daily']
  },
  
  /**
   * Book notes template
   */
  bookNotes: {
    title: 'Book Notes: [Book Title]',
    content: `## Book Information
- **Title:** 
- **Author:** 
- **Genre:** 
- **Pages:** 
- **Date Read:** 

## Summary


## Key Takeaways
1. 
2. 
3. 

## Favorite Quotes
> 

## Chapter Notes


## My Rating
⭐⭐⭐⭐⭐

## Would I Recommend?


## Action Items
- 

`,
    tags: ['book', 'reading', 'notes']
  },
  
  /**
   * Recipe template
   */
  recipe: {
    title: 'Recipe: [Dish Name]',
    content: `## Overview
- **Prep Time:** 
- **Cook Time:** 
- **Servings:** 
- **Difficulty:** 

## Ingredients
- 

## Instructions
1. 
2. 
3. 

## Tips & Variations


## Nutritional Information


## Notes

`,
    tags: ['recipe', 'cooking']
  },
  
  /**
   * Code snippet template
   */
  codeSnippet: {
    title: 'Code: [Description]',
    content: `## Description


## Language
\`language-name\`

## Code
\`\`\`
// Your code here
\`\`\`

## Usage Example
\`\`\`
// Example usage
\`\`\`

## Notes


## References
- 

`,
    tags: ['code', 'snippet', 'programming']
  },
  
  /**
   * Research template
   */
  research: {
    title: 'Research: [Topic]',
    content: `## Research Question


## Background


## Key Findings
1. 
2. 
3. 

## Sources
1. 
2. 
3. 

## Analysis


## Conclusions


## Further Questions


## References

`,
    tags: ['research', 'study']
  }
};

/**
 * Gets a template by name
 * @param {string} name - Template name
 * @returns {Object} Template
 */
export const getTemplate = (name) => {
  return noteTemplates[name] || noteTemplates.blank;
};

/**
 * Creates a note from template
 * @param {string} templateName - Template name
 * @param {Object} customizations - Custom values
 * @returns {Object} New note
 */
export const createFromTemplate = (templateName, customizations = {}) => {
  const template = getTemplate(templateName);
  
  return {
    ...JSON.parse(JSON.stringify(template)),
    ...customizations,
    title: customizations.title || template.title.replace(/\[.*\]/g, ''),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Formats date for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Escapes HTML entities
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
const escapeHTML = (text) => {
  const div = { textContent: text };
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Generates a unique ID
 * @returns {string} Unique ID
 */
export const generateNoteId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `note_${timestamp}_${random}`;
};

/**
 * Gets note excerpt
 * @param {string} content - Note content
 * @param {number} maxLength - Maximum length
 * @returns {string} Excerpt
 */
export const getExcerpt = (content, maxLength = 150) => {
  const plainText = toPlainText(content);
  if (plainText.length <= maxLength) return plainText;
  
  return plainText.substring(0, maxLength).trim() + '...';
};

/**
 * Calculates note similarity
 * @param {Object} note1 - First note
 * @param {Object} note2 - Second note
 * @returns {number} Similarity score (0-1)
 */
export const calculateSimilarity = (note1, note2) => {
  const text1 = toPlainText(note1.content || '').toLowerCase();
  const text2 = toPlainText(note2.content || '').toLowerCase();
  
  const words1 = new Set(text1.split(/\s+/).filter(w => w.length > 3));
  const words2 = new Set(text2.split(/\s+/).filter(w => w.length > 3));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
};

/**
 * Finds related notes
 * @param {Object} note - Reference note
 * @param {Array} allNotes - All notes to search
 * @param {number} limit - Maximum results
 * @returns {Array} Related notes
 */
export const findRelatedNotes = (note, allNotes, limit = 5) => {
  if (!note || !allNotes) return [];
  
  return allNotes
    .filter(n => n._id !== note._id)
    .map(n => ({
      ...n,
      similarity: calculateSimilarity(note, n)
    }))
    .filter(n => n.similarity > 0.1)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Formatting
  toPlainText,
  markdownToHTML,
  htmlToMarkdown,
  
  // Search
  searchNotes,
  fuzzyMatch,
  highlightMatches,
  
  // Export
  NoteExporter,
  
  // Versioning
  NoteVersionManager,
  
  // Analysis
  analyzeNote,
  
  // Sorting and filtering
  sortNotes,
  filterNotes,
  
  // Templates
  noteTemplates,
  getTemplate,
  createFromTemplate,
  
  // Utilities
  generateNoteId,
  getExcerpt,
  calculateSimilarity,
  findRelatedNotes
};
