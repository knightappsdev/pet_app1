# Contributing to Pet Care & Support Platform

Thank you for your interest in contributing to the Pet Care & Support Platform! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 1. Fork the Repository
```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/your-username/pet-care-platform.git
cd pet-care-platform
```

### 2. Set up Development Environment
```bash
# Install dependencies
npm install
cd pwa && npm install && cd ..

# Set up environment variables
cp .env.example .env
# Edit .env with your local configuration

# Start development servers
npm run dev        # Backend server
cd pwa && npm run dev  # PWA development server
```

### 3. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-description
# or
git checkout -b hotfix/urgent-fix
```

### 4. Make Your Changes
- Write clean, well-documented code
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed

### 5. Test Your Changes
```bash
# Run backend tests
npm test

# Run PWA tests
cd pwa && npm test

# Test API endpoints
npm run test:api

# Check code style
npm run lint
```

### 6. Commit Your Changes
Use conventional commit messages:
```bash
# Feature commits
git commit -m "feat: add pet health reminder system"

# Bug fixes
git commit -m "fix: resolve authentication token expiration issue"

# Documentation
git commit -m "docs: update API endpoint documentation"

# Style changes
git commit -m "style: improve mobile navigation layout"

# Refactoring
git commit -m "refactor: optimize database queries for pet search"
```

### 7. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
# Then create a Pull Request on GitHub
```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for new frontend code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for functions and APIs
- Follow RESTful API conventions

### Database Guidelines
- Use proper MongoDB indexes for queries
- Validate all user input at the model level
- Follow UK-specific data formats where applicable
- Implement proper error handling

### Frontend Guidelines
- Use React functional components with hooks
- Implement responsive design (mobile-first)
- Follow Tailwind CSS utility classes
- Ensure accessibility standards (WCAG 2.1)
- Add proper TypeScript types

### API Guidelines
- Follow RESTful conventions
- Use proper HTTP status codes
- Implement comprehensive error handling
- Add request/response validation
- Document all endpoints

## 🧪 Testing Requirements

### Unit Tests
```bash
# Backend unit tests
npm run test:unit

# Frontend component tests
cd pwa && npm run test:unit
```

### Integration Tests
```bash
# API integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e
```

### Manual Testing
- Test on different devices and browsers
- Verify PWA functionality
- Check authentication flows
- Validate all CRUD operations

## 📝 Pull Request Guidelines

### Before Submitting
- [ ] Code passes all tests
- [ ] Documentation is updated
- [ ] Changes are backwards compatible
- [ ] Performance impact is considered
- [ ] Security implications are reviewed

### Pull Request Template
```markdown
## Description
Brief description of changes made

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots of UI changes

## Additional Notes
Any additional information for reviewers
```

## 🐛 Bug Reports

### Before Reporting
- Check existing issues for duplicates
- Ensure you're using the latest version
- Test in multiple browsers if frontend issue

### Bug Report Template
```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. iOS, Windows, Mac]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]
- Device: [e.g. iPhone6, Desktop]

**Additional context**
Add any other context about the problem here.
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## 🏷 Release Process

### Versioning
We follow [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH`
- Major: Breaking changes
- Minor: New features (backwards compatible)
- Patch: Bug fixes (backwards compatible)

### Release Checklist
- [ ] Update version numbers
- [ ] Update CHANGELOG.md
- [ ] Run full test suite
- [ ] Update documentation
- [ ] Create release tag
- [ ] Deploy to staging
- [ ] Deploy to production

## 🎯 Areas for Contribution

### High Priority
- Performance optimizations
- Accessibility improvements
- Mobile user experience
- Test coverage expansion
- API documentation

### Medium Priority
- New pet care features
- Integration with veterinary systems
- Advanced search and filtering
- Notification system enhancements
- Admin dashboard features

### Low Priority
- UI/UX improvements
- Code refactoring
- Development tooling
- Documentation improvements

## 📞 Getting Help

### Community
- GitHub Discussions for general questions
- GitHub Issues for bug reports and feature requests
- Code review feedback on Pull Requests

### Development Setup Issues
1. Check the README.md setup instructions
2. Search existing issues
3. Create a new issue with "setup" label

### Code Questions
1. Check inline code documentation
2. Review existing implementations
3. Ask in GitHub Discussions

## 🙏 Recognition

Contributors are recognized in:
- CONTRIBUTORS.md file
- Release notes
- GitHub contributors graph
- Special thanks in documentation

## 📄 Code of Conduct

### Our Pledge
We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards
Examples of behavior that contributes to creating a positive environment include:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement
Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

---

Thank you for contributing to the Pet Care & Support Platform! Your efforts help make pet care better for everyone. 🐾