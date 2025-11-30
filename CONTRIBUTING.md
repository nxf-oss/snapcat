# Contributing Guidelines

Thank you for your interest in contributing to this repository. Contributions are valuable and help improve the project for everyone. Please review the guidelines below before opening a pull request or issue.

This document applies to the repository:

`https://github.com/nxf-oss/snapcat`

---

## 1. Code of Conduct

By participating in this project, contributors are expected to uphold respectful and constructive communication at all times. Harassment, discrimination, personal attacks, and unprofessional behavior are not tolerated.

---

## 2. Ways to Contribute

You can contribute to this project in multiple ways:

| Contribution Type        | Description                                                                     |
| ------------------------ | ------------------------------------------------------------------------------- |
| Reporting Issues         | Identify bugs, unexpected behavior, security concerns, or performance problems. |
| Proposing Enhancements   | Suggest improvements, new features, or refinements.                             |
| Submitting Pull Requests | Fix bugs, add features, improve documentation, or maintain code structure.      |
| Improving Documentation  | Enhance clarity, correctness, and completeness of project documentation.        |

---

## 3. Issue Reporting Guidelines

Before opening an issue, please:

1. Search existing issues to avoid duplicates.
2. Confirm that the issue is reproducible.
3. Include enough technical detail for maintainers to understand the problem.

Recommended issue format:

```
Title: Short descriptive summary

## Description
Clear explanation of the problem or suggestion.

## Steps to Reproduce (if applicable)
1. Step one
2. Step two
3. ...

## Expected Behavior
Explain the expected outcome.

## Actual Behavior
Explain what actually occurred.

## Additional Information
Logs, screenshots, environment details, references, etc.
```

---

## 4. Pull Request Guidelines

To help maintain code quality and review efficiency, follow these requirements:

### 4.1 Requirements

- One pull request must target one logical change.
- Ensure code builds without errors.
- Ensure no confidential or proprietary information is included.
- Provide tests when applicable.
- Update documentation when relevant.

### 4.2 Commit Message Format

Use clear, structured commit messages:

```
<type>(scope): short summary

Optional body explaining what and why, not how.
```

Valid commit types include:

| Type     | Purpose                                      |
| -------- | -------------------------------------------- |
| feat     | A new feature                                |
| fix      | A bug fix                                    |
| docs     | Documentation changes only                   |
| style    | Code style changes (no logic impact)         |
| refactor | Code change that improves internal structure |
| perf     | Performance improvement                      |
| test     | Adding or modifying tests                    |
| build    | Build system or dependency change            |
| ci       | Continuous integration update                |
| chore    | Maintenance tasks with no behavior impact    |

### 4.3 Pull Request Template

```
## Summary
Brief description of the change.

## Related Issue
Link any related issue here.

## Changes
- Bullet list of changes

## Tests
Describe test coverage or explain why tests are unnecessary.

## Additional Notes
Any relevant context or technical considerations.
```

---

## 5. Coding Standards

Depending on snippet language, follow these standards:

| Language                | Standard / Format                            |
| ----------------------- | -------------------------------------------- |
| Python                  | PEP 8 style guidelines                       |
| JavaScript / TypeScript | ESLint recommended rules                     |
| Go                      | `gofmt` and idiomatic Go guidelines          |
| Shell                   | POSIX compatible unless specified otherwise  |
| Markdown                | Concise, consistent headings and code fences |

General rules:

- Write clear, maintainable, and well-documented code.
- Favor self explanatory naming conventions.
- Avoid unnecessary external dependencies.
- Security must be considered in all contributions.

---

## 6. Directory and File Structure

Snippet submissions must follow:

```
snipets/
  <category>/
    <name>.<ext>
    README.md (optional, recommended)
```

Example categories:

- `bash/`
- `python/`
- `devops/`
- `docker/`
- `regex/`
- `sql/`

---

## 7. Licensing

By contributing, you agree that your work will be released under the repository license. Ensure that you have the right to contribute the code or material.

---

## 8. Security Reporting

Security vulnerabilities must not be submitted publicly through issues. Please report them responsibly to the project maintainer via private communication, if available.

---

## 9. Review Process

Pull requests are reviewed with attention to:

- Technical correctness
- Security implications
- Code clarity and structure
- Consistency with project goals

Approval may require updates or feedback responses before merging.

---

## 10. Contact

If you have questions related to contributions, open a discussion or issue in the repository.

Thank you for contributing and improving this project.
