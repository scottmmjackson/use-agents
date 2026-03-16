# Default target: show help
default:
    @just --list

# Install dependencies
install:
    npm install

# Build the project
build:
    npm run build

# Run linting
lint:
    npm run lint

# Run formatting
format:
    npm run format
    just --fmt --unstable

# Run tests
test:
    npm run test

# Clean build artifacts
clean:
    rm -rf dist node_modules

# Publish to NPM
publish: build test lint
    npm publish --access public
