#!/bin/bash

# Create a virtual environment (optional but recommended)
#python3 -m venv venv
#. venv/bin/activate

# Install pre-commit
pip install pre-commit

# Install linters and dependencies
pip install flake8 pylint
npm install eslint eslint-config-airbnb-base prettier

# Create pre-commit configuration file
cat <<EOF > .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v3.4.0
    hooks:
      - id: trailing-whitespace

  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.1.0
    hooks:
      - id: prettier
        types_or: [css, javascript]

  - repo: https://github.com/PyCQA/flake8
    rev: 7.0.0
    hooks:
      - id: flake8
        files: \.py$
EOF

# Install pre-commit hooks
pre-commit install

echo "Setup complete. Now you can start coding with pre-commit hooks."
