
# Contributing to Prisma Drop Migration Warning

Thank you for your interest in contributing to **Prisma Drop Migration Warning**! We welcome all contributions, whether they are issues, bug fixes, or new features. Before contributing, please take a moment to review this guide.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Setting Up the Environment](#setting-up-the-environment)
- [Scripts](#scripts)
- [Testing](#testing)
- [Linting and Formatting](#linting-and-formatting)
- [Building the Package](#building-the-package)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Code of Conduct](#code-of-conduct)

## Getting Started

1. Fork this repository.
2. Clone your fork to your local machine:
    ```bash
    git clone https://github.com/your-username/prisma-drop-migration-warning.git
    ```
3. Navigate to the project directory:
    ```bash
    cd prisma-drop-migration-warning
    ```
4. Install dependencies:
    ```bash
    npm install
    ```

## Project Structure

The project is organized as follows:

- **_tests/**: Contains test files for validating the functionality of the project (Jest)
- **dist/**: The bundled output directory created by `ncc` for publishing.
- **lib/**: The compiled JavaScript code after TypeScript is transpiled.
- **src/**: The source TypeScript files.
- **tsconfig.json**: TypeScript configuration file.
- **.eslintrc.js**: ESLint configuration for linting JavaScript/TypeScript files.
- **package.json**: Project metadata and scripts.

## Setting Up the Environment

Make sure you have Node.js (v16+) and npm installed. After cloning the repository and running `npm install`, you should be able to run all scripts and tests.

## Scripts

Here’s a list of available npm scripts:

- **`npm run build`**: Compiles the TypeScript code in the `src/` folder into JavaScript and places it in the `lib/` directory.
- **`npm run test`**: Runs the tests using Jest.
- **`npm run lint`**: Lints the code using ESLint.
- **`npm run lint:fix`**: Lints the code and automatically fixes issues where possible.
- **`npm run package`**: Bundles the project using `@vercel/ncc` and generates the output in the `dist/` folder.
- **`npm run build:package`**: Combines both the build and package steps.

## Testing

We use **Jest** for testing. You can run all the tests using:

```bash
npm run test
```

Make sure to add tests for any new features or changes. Test files are located in the _tests/ directory. Tests should follow the format *.test.js.

Thank you for contributing! 🙌
