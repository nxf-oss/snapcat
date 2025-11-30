# Security Policy

This document describes the security policy and vulnerability reporting guidelines for the **neuxdotdev/snipets** project. Security is a priority for this project and all contributors are expected to handle potential vulnerabilities responsibly.

---

## Supported Versions

Security updates will be provided for the following branches and versions:

| Version/Branch               | Status             |
| ---------------------------- | ------------------ |
| master                       | Actively supported |
| dev                          | Actively supported |
| any archived or EOL branches | Not supported      |

Users are strongly encouraged to run the most recent stable version.

---

## Reporting a Vulnerability

If you discover a security vulnerability, do not submit it publicly through issues or discussions.

To report a vulnerability, contact:

**Email:** `neuxdev1@gmail.com`

When reporting, please include:

- A clear description of the vulnerability
- Steps to reproduce the issue
- Potential impact and severity
- Any relevant logs, screenshots, or proof of concept
- Suggested remediation if available

We will acknowledge receipt of the report and provide a status update within a reasonable timeframe.

---

## Disclosure Procedure

The project follows a private and responsible disclosure process:

1. Vulnerability is reported via the private security channel.
2. The maintainers investigate and validate the report.
3. A fix or mitigation is developed.
4. A release is published that resolves the issue.
5. A public disclosure may be published after users have had a reasonable chance to update.

---

## Security Expectations for Contributors

Contributors must:

- Avoid introducing insecure dependencies or code patterns.
- Follow secure coding practices, including input validation and proper error handling.
- Never commit secrets, tokens, passwords, or private API keys.
- Immediately report any accidental credential leak.
- Use private channels for discussions related to security issues.

Pull requests introducing security-sensitive changes may require additional review.

---

## Handling Cryptographic Material

If the project uses cryptography:

- Only well-reviewed, widely accepted libraries should be used.
- Custom, experimental, or home-grown cryptography is strictly prohibited.
- Keys must never be stored within the repository.

---

## Security FAQ

| Question                                | Answer                                                |
| --------------------------------------- | ----------------------------------------------------- |
| Can I report low-severity bugs?         | Yes. All security concerns are welcome.               |
| Will researchers be acknowledged?       | If requested and disclosure is responsible, yes.      |
| Are denial-of-service reports accepted? | Yes, if reproducible and verifiable.                  |
| Can I test production systems?          | No. Testing must be done within permitted scope only. |

---

## Legal Safe Harbor

As long as security research is conducted:

- In good faith
- Within the described reporting process
- Without privacy violations, data destruction, or service disruption

The project will not pursue legal action for vulnerability discovery and responsible disclosure.

---

## Contact

For any questions or clarifications about this Security Policy:

`neuxdev1@gmail.com`

Thank you for helping keep this project secure.
