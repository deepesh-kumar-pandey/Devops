# Contributing to DevOps Platform

Thank you for your interest in contributing to the DevOps Platform! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Maintain professional communication

## Getting Started

1. **Fork the repository**
   ```bash
   gh repo fork your-username/devops-platform
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/devops-platform.git
   cd devops-platform
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original/devops-platform.git
   ```

4. **Set up development environment**
   - Follow instructions in README.md
   - Ensure all tests pass
   - Start the application locally

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Write clean, maintainable code
   - Follow coding standards
   - Add tests for new features
   - Update documentation

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

4. **Keep your branch updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

## Coding Standards

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints
- Maximum line length: 100 characters
- Use Black for formatting
- Use flake8 for linting

```bash
# Format code
black app/

# Check linting
flake8 app/

# Type checking
mypy app/
```

### TypeScript/React (Frontend)

- Follow Airbnb style guide
- Use TypeScript for type safety
- Use functional components with hooks
- Prefer named exports
- Use ESLint and Prettier

```bash
# Format code
npm run lint

# Type checking
npm run type-check
```

### General Guidelines

- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Follow DRY (Don't Repeat Yourself)
- Use meaningful variable names
- Avoid premature optimization

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_users.py

# Run specific test
pytest tests/test_users.py::test_create_user
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Writing Tests

- Write tests for new features
- Maintain >80% code coverage
- Test edge cases and error conditions
- Use descriptive test names
- Mock external dependencies

Example backend test:
```python
async def test_create_user(client, db):
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "testpass123"
        }
    )
    assert response.status_code == 200
    assert "id" in response.json()
```

Example frontend test:
```typescript
describe('Login Component', () => {
  it('should render login form', () => {
    render(<Login />)
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })
})
```

## Pull Request Process

1. **Ensure all tests pass**
   ```bash
   # Backend
   cd backend && pytest
   
   # Frontend
   cd frontend && npm test
   ```

2. **Update documentation**
   - README.md if needed
   - API documentation
   - Code comments
   - CHANGELOG.md

3. **Create pull request**
   - Use a clear, descriptive title
   - Describe what changed and why
   - Link related issues
   - Add screenshots for UI changes
   - Request review from maintainers

4. **PR Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - [ ] Tests added/updated
   - [ ] All tests passing
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No new warnings
   ```

5. **Address review feedback**
   - Respond to comments
   - Make requested changes
   - Push updates to your branch

6. **Squash commits (if requested)**
   ```bash
   git rebase -i HEAD~n  # n = number of commits
   git push --force-with-lease
   ```

## Areas for Contribution

### High Priority
- Bug fixes
- Security improvements
- Performance optimizations
- Test coverage
- Documentation

### Features
- Additional integrations (GitHub, GitLab, Jenkins)
- Advanced monitoring and alerting
- Custom dashboard widgets
- API improvements
- CLI tools

### Documentation
- Tutorials and guides
- API documentation
- Architecture diagrams
- Troubleshooting guides
- Video tutorials

## Getting Help

- Open an issue for questions
- Join our Discord/Slack community
- Check existing issues and PRs
- Read the documentation

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

Thank you for contributing to DevOps Platform! 🚀
