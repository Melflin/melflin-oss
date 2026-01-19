# Contributing to Melflin OSS Skills

Welcome! 👋 Thanks for your interest in contributing to the Melflin productivity skills collection.

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/yourusername/melflin-oss`
3. **Create a branch**: `git checkout -b feature/your-feature-name`
4. **Make your changes** (see guidelines below)
5. **Test thoroughly** (see Testing section)
6. **Submit a pull request**

## 🎯 What We're Looking For

### 🐛 Bug Fixes
- Clear reproduction steps
- Fix with tests
- Documentation updates if needed

### ✨ New Features
- Solve real productivity problems
- Follow existing skill architecture
- Include comprehensive tests and docs

### 📚 Documentation
- Improve README files
- Add usage examples
- Fix typos or unclear instructions

### 🔧 Code Quality
- Performance improvements
- Code organization
- Error handling improvements

## 📋 Skill Architecture

All skills follow a consistent pattern for maintainability:

```
skills/your-skill/
├── fetch.js     # Get data from source systems
├── analyze.js   # Process data (often with AI)
├── execute.js   # Apply changes or generate output
├── index.js     # CLI interface and argument parsing
├── package.json # Dependencies and metadata
├── README.md    # Documentation with examples
└── test/        # Test files (optional but encouraged)
```

### Core Principles

1. **Safety First**: Always backup before destructive operations
2. **Dry Run Support**: Include `--dry-run` for testing  
3. **Clear Output**: Progress indicators and helpful error messages
4. **Idempotent**: Safe to run multiple times
5. **Fast**: Optimize for daily use (< 5 second execution)

## 🧪 Testing Your Changes

### Manual Testing
```bash
cd skills/your-skill
npm install
node index.js --help
node index.js --dry-run  # Test without side effects
```

### Required Tests
- **Happy path**: Normal operation works
- **Edge cases**: Empty inputs, missing files, API failures
- **Error handling**: Graceful failures with helpful messages
- **Safety**: Backup/restore functionality if applicable

### Test Checklist
- [ ] Skill works on fresh macOS install
- [ ] All CLI flags work as documented
- [ ] Error messages are helpful
- [ ] No API keys leaked in logs
- [ ] Performance acceptable (< 5s for normal use)

## 📖 Documentation Standards

### README.md Structure
Every skill should have:

1. **Description** (1-2 sentences)
2. **Installation** (step-by-step)
3. **Usage Examples** (realistic scenarios)
4. **Configuration** (if any)
5. **Troubleshooting** (common issues)
6. **Contributing** (link to this file)

### Code Comments
- Explain **why**, not **what**
- Document any API limitations or quirks
- Note performance considerations
- Explain safety mechanisms

## 🔐 Security Guidelines

### API Keys
- Never commit API keys
- Use environment variables or secure storage
- Document required keys in README
- Provide clear setup instructions

### Data Privacy
- Minimize data collection
- Prefer local processing when possible
- Document what data is sent to external APIs
- Respect user privacy settings

### Safe Operations
- Always backup before destructive changes
- Implement restore mechanisms
- Validate inputs thoroughly
- Use dry-run mode for testing

## 📝 Pull Request Guidelines

### Before Submitting
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Code follows existing style
- [ ] Commit messages are descriptive
- [ ] No sensitive data in commits

### PR Description Template
```markdown
## What does this PR do?
Brief description of the change

## Problem it solves
What issue does this address?

## Testing done
- [ ] Manual testing on macOS
- [ ] Edge case testing
- [ ] Documentation verified

## Breaking changes?
- [ ] Yes (describe impact)
- [ ] No

## Screenshots (if applicable)
Before/after command output
```

### Review Process
1. **Automated checks** must pass
2. **Maintainer review** for code quality
3. **Manual testing** on real systems
4. **Merge** after approval

## 🏆 Recognition

Contributors get:
- Credit in the README
- GitHub contributor badge
- Shoutout on Twitter/social media
- Early access to new features

## 💬 Getting Help

### Before Opening an Issue
- Check existing issues
- Try the troubleshooting guide
- Test with latest version

### Communication Channels
- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: General questions, ideas
- **Email**: security@melflin.dev (security issues only)

### Response Times
- Bug reports: 2-3 days
- Feature requests: 1 week
- Security issues: 24 hours

## 📊 Development Process

### Priority Levels
1. **Critical bugs**: Data loss, security issues
2. **User-requested features**: From actual users
3. **Performance improvements**: Speed optimizations  
4. **Nice-to-haves**: Quality of life improvements

### Release Schedule
- **Patch releases**: Bug fixes (as needed)
- **Minor releases**: New features (monthly)
- **Major releases**: Breaking changes (quarterly)

## 🤝 Code of Conduct

### Be Respectful
- Use inclusive language
- Accept constructive criticism
- Focus on what's best for the community

### Be Collaborative  
- Help newcomers
- Share knowledge
- Give credit where due

### Be Patient
- Remember this is volunteer-driven
- Provide clear, actionable feedback
- Test thoroughly before reporting issues

---

## 🎉 Thank You!

Every contribution makes these tools better for the entire community. Whether it's fixing a typo, reporting a bug, or building a whole new feature—it all matters.

**Questions?** Open an issue or start a discussion. We're here to help!

---

**Happy coding!** 🚀