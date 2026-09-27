## 💬 Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) to automatically generate version numbers and `CHANGELOG.md` entries using Release Please. 

Every pull request title and commit message must follow this standard format:
`<type>: <description>` (e.g., `feat: add visual module builder`)

### 📢 User-Facing Changes (Visible in Changelog)
These prefixes indicate changes that impact the end-user. They will automatically appear in our release notes.

*   **`feat:`** 🚀 A new feature (Triggers a **Minor** release: `1.0.0` -> `1.1.0`)
    *   *Example:* `feat: add support for HDI container resources`
*   **`fix:`** 🐛 A bug fix (Triggers a **Patch** release: `1.0.0` -> `1.0.1`)
    *   *Example:* `fix: resolve crash when mta.yaml is missing resources array`
*   **`perf:`** ⚡ A code change that improves performance.
    *   *Example:* `perf: optimize YAML parsing speed for large descriptors`
*   **`docs:`** 📝 Documentation updates that help users (Guides, README, API docs).
    *   *Example:* `docs: add tutorial for mapping UI5 modules to Approuter`
*   **`refactor:`** ♻️ A code change that neither fixes a bug nor adds a feature, but improves codebase structure.
    *   *Example:* `refactor: convert component routing to switch statements`

### 🙈 Internal Changes (Hidden from Changelog)
These prefixes are used for developer-facing changes. They are safely ignored by the release notes to keep the changelog clean and focused.

*   **`chore:`** 🔧 Routine tasks, dependency updates, or internal tooling changes.
*   **`ci:`** 👷 Changes to our CI configuration files and scripts (e.g., GitHub Actions).
*   **`test:`** ✅ Adding missing tests or correcting existing ones.

---

### 🚨 Breaking Changes (Major Version Bumps)
If your pull request introduces a breaking change (e.g., changing the core data model, removing an existing feature, or requiring a higher Node.js version), you must append an exclamation mark `!` directly after the type prefix.

**Format:** `<type>!: <description>`

This tells the CI pipeline to trigger a **Major** release (e.g., `1.x.x` -> `2.0.0`).

*   **Example 1:** `feat!: completely redesign the JSON schema validation`
*   **Example 2:** `refactor!: drop support for Node 18`

Whenever you use `!`, please ensure the body of your pull request includes a detailed explanation of what broke and how users can migrate to the new version.