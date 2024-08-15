#!/bin/bash

if [ -n "$NVM_DIR" ] && [ -s "$NVM_DIR/nvm.sh" ]; then
    echo "nvm is already installed."

    # Ensure nvm is loaded if installed earlier
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
else
    echo "Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

    # Load nvm into the current session
    echo "Loading nvm..."
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
fi

# Step 2: Check if Node.js 18 is installed
if command -v node > /dev/null 2>&1; then
    # echo "Node.js version 18 is already installed."
    echo "Node.js is already installed."
else
    echo "Installing Node.js version 18..."
    nvm install 18
    echo "Setting Node.js 18 as the default version..."
    nvm alias default 18
fi

# Step 3: Check if whistle is installed
if command -v whistle > /dev/null 2>&1; then
    echo "whistle is already installed."
else
    echo "Installing whistle package globally..."
    npm install -g whistle
fi

# Step 4: Confirm installation
echo "Installation complete."
echo "nvm: $(nvm -v)"
echo "node: $(node -v)"
echo "npm: $(npm -v)"
echo "whistle: $(whistle -V)"

echo "Starting whistle..."
w2 start
