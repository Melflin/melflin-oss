# Contributing to Melflin OSS

Thank you for your interest in contributing! This document outlines the process for contributing to this project.

## How to Contribute

### 1. Reporting Bugs
Use the [Bug Report issue template](.github/ISSUE_TEMPLATE/bug_report.yml) to report bugs. Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### 2. Suggesting Features
Use the [Feature Request issue template](.github/ISSUE_TEMPLATE/feature_request.yml) to suggest new skills or improvements.

### 3. Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-new-skill`)
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/melflin-oss.git
cd melflin-oss

# Install dependencies (if any)
npm install

# Create a new skill
# See docs/CREATING_SKILLS.md for guidelines
```

## Skill Structure

Each skill follows this pattern:
```
skills/
└── your-skill/
    ├── fetch.js      # Get data
    ├── analyze.js    # Process data
    ├── execute.js    # Apply changes
    ├── index.js      # CLI entrypoint
    └── README.md     # Documentation
```

## Code Style

- Use ES6+ JavaScript
- Include comments for complex logic
- Add error handling for all async operations
- Follow existing patterns in other skills

## Questions?

Start a [GitHub Discussion](https://github.com/Melflin/melflin-oss/discussions) for questions.
