---
layout: page
title: CSS
---

<style>
/* Custom Melflin Styling */

/* Base improvements */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Headings */
h1, h2, h3, h4 {
  color: #1a1a2e;
  font-weight: 600;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 1rem;
  border-bottom: 3px solid #667eea;
  padding-bottom: 0.5rem;
}

h2 {
  font-size: 1.6rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

h3 {
  font-size: 1.3rem;
  color: #4a5568;
}

/* Links */
a {
  color: #667eea;
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Cards for skills */
.skill-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
}

.skill-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.skill-card.fertig {
  border-color: #48bb78;
}

.skill-card.in-progress {
  border-color: #ed8936;
}

.skill-card.geplant {
  border-color: #a0aec0;
}

/* Status badges */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 0.5rem;
}

.status-badge.fertig {
  background: #48bb78;
  color: white;
}

.status-badge.in-progress {
  background: #ed8936;
  color: white;
}

.status-badge.geplant {
  background: #a0aec0;
  color: white;
}

/* Achievement cards */
.achievement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.achievement-card {
  padding: 1.25rem;
  border-radius: 12px;
  color: white;
  text-align: center;
  transition: transform 0.2s;
}

.achievement-card:hover {
  transform: scale(1.02);
}

.achievement-card .emoji {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.achievement-card strong {
  display: block;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.achievement-card small {
  opacity: 0.9;
  font-size: 0.85rem;
}

/* Journey timeline */
.journey-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.journey-item {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.journey-item .date {
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.journey-item .event {
  font-weight: 600;
  color: #2d3748;
}

.journey-item .desc {
  font-size: 0.85rem;
  color: #4a5568;
  margin-top: 0.25rem;
}

/* Value table */
.value-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.value-table th, .value-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.value-table th {
  background: #f7fafc;
  font-weight: 600;
  color: #2d3748;
}

/* Blog post styling */
.blog-post {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.blog-post h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.blog-post .date {
  font-size: 0.85rem;
  color: #718096;
  margin-bottom: 0.5rem;
}

/* Code blocks */
pre {
  background: #1a1a2e;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}

code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9em;
}

/* Navigation hint */
.nav-hint {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
}

.nav-hint a {
  color: #ffd700;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 600px) {
  h1 { font-size: 1.8rem; }
  h2 { font-size: 1.4rem; }
  .achievement-grid { grid-template-columns: 1fr; }
  .journey-grid { grid-template-columns: 1fr; }
}
</style>
