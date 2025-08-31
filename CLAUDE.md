# MimicWriters Project Rules

## Development Rules

### 1. Code Style
- All code MUST follow eslint/airbnb formatting rules
- Write readable, self-documenting code
- Use descriptive variable and function names

### 2. Testing
- Write concise test cases for all functions
- Aim for minimal but effective test coverage

### 3. Development Process
- Check if similar code already exists before adding new code
- Review code plan to avoid over-engineering
- Refactor duplicate code after implementation
- Maintain simple structure during refactoring
- Run tests again after refactoring to ensure success
- Run development server after tests pass to verify functionality
- Create Git commit once everything works properly

### 4. Git Commits
- Create atomic commits for minimal functional units
- Commit only after:
  - Feature is complete
  - Tests pass
  - Code is properly formatted with black
- Use clear, descriptive commit title
- Do not write commit body, but only commit title
