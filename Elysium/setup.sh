#!/bin/bash

# Install pre-commit
pip install pre-commit

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate

# Install linters and dependencies
pip install flake8 pylint
npm install eslint eslint-config-airbnb-base

# Create pre-commit configuration file
echo "- repo: https://github.com/pre-commit/pre-commit-hooks" > .pre-commit-config.yaml
echo "  rev: v3.4.0" >> .pre-commit-config.yaml
echo "  hooks:" >> .pre-commit-config.yaml
echo "    - id: trailing-whitespace" >> .pre-commit-config.yaml

echo "- repo: https://github.com/pre-commit/mirrors-eslint" >> .pre-commit-config.yaml
echo "  rev: v6.6.0" >> .pre-commit-config.yaml
echo "  hooks:" >> .pre-commit-config.yaml
echo "    - id: eslint" >> .pre-commit-config.yaml
echo "      files: \\.js$" >> .pre-commit-config.yaml
echo "      additional_dependencies: [eslint-config-airbnb-base]" >> .pre-commit-config.yaml

echo "- repo: https://github.com/pre-commit/mirrors-flake8" >> .pre-commit-config.yaml
echo "  rev: v3.9.2" >> .pre-commit-config.yaml
echo "  hooks:" >> .pre-commit-config.yaml
echo "    - id: flake8" >> .pre-commit-config.yaml
echo "      files: \\.py$" >> .pre-commit-config.yaml

# Install pre-commit hooks
pre-commit install

echo "Setup complete. Now you can start coding with pre-commit hooks."
