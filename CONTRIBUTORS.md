
# Contributing to MTA Lens (REWRITE)

First off, thank you for considering contributing to **MTA Lens**! 

Whether you are here to fix a bug, add a new feature, or simply correct a typo in our documentation, your help is what makes this open-source community thrive. Our goal is to banish `mta.yaml` indentation errors and deployment headaches forever, and we would love your help to build it.

## 🗺️ Project Roadmap & MVP
We are currently focusing on our **MVP (Minimum Viable Product)**. 
Our current priorities are:
1. Reliable file upload and `js-yaml` parsing.
2. A stable SplitApp UI to view modules and resources.
3. Exporting properly formatted YAML back to the user.

Before submitting a massive architectural change, please open an issue to discuss it. We want to ensure it aligns with the current release phase!

---

## 🛠️ How You Can Contribute

### 1. Reporting Bugs
Found a YAML file that crashes the parser? Did the UI5 routing break? 
* Check the [Issues](#) tab to see if it has already been reported.
* Open a new issue using the **Bug Report** template.
* Please include your browser version, the snippet of the `mta.yaml` that caused the issue, and steps to reproduce.

### 2. Suggesting Enhancements
Have an idea for a new template or a better way to map `requires` and `provides`?
* Open an issue using the **Feature Request** template.
* Explain the problem your feature solves and how it fits into the overall UI.

### 3. Contributing Code
Ready to write some UI5 code? Awesome.
1. **Fork** the repository to your own GitHub account.
2. **Clone** the project to your local machine.
3. **Create a branch** for your feature or bug fix: 
   `git checkout -b feature/amazing-new-module` or `git checkout -b fix/yaml-spacing`

#### Local Development Setup
This project runs on standard SAP UI5 tooling.
```bash
# Install dependencies (including UI5 tooling and js-yaml)
npm install

# Start the local development server
npm run start

```

### 4. Code Guidelines

* **UI5 Standards:** Try to stick to standard UI5 MVC principles. Keep business logic in controllers (or formatters) and structure in XML Views.
* **Format Before Committing:** Run `npm run lint` (if configured) to ensure your code matches the project's formatting rules.
* **Keep Dependencies Light:** We want this app to be fast. If you need to add a new npm package, please discuss it in an issue first.

---

## 🚀 Pull Request Process

1. Ensure your code works locally and doesn't break the YAML parser.
2. Update the `README.md` if your changes require new setup instructions.
3. Submit a Pull Request against the `main` (or `develop`) branch.
4. Provide a clear, descriptive PR title and link any relevant issue numbers (e.g., `Fixes #42`).
5. A maintainer will review your code. We might request a few changes—don't take it personally, it's just part of the process!

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](https://www.google.com/search?q=CODE_OF_CONDUCT.md&utm_source=gemini). In short: be respectful, be collaborative, and assume good intentions.

---

## 🏆 Contributors Hall of Fame

A massive thank you to everyone who has helped build this tool! *(Add yourself to this list in your first Pull Request!)*

| Name/Handle | Contribution |
| --- | --- |