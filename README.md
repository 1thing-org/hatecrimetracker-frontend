# Dev Setup

1. Install NodeJS and npm
    Follow instructiion at: https://nodejs.org/
2. Install Yarn
    
    `npm install --global yarn`
3. Install git (should already be installed on MacOSX)
4. Clone code from GitHub:
    
    `git clone https://github.com/1thing-org/hatecrimetracker-frontend.git`

5. Change configuration in `hatecrimetracker-frontend/src/configs/appConfig.js`

    Make sure `api_endpoint: 'https://api.hatecrimetracker.1thing.org'`

6. Under hatecrimetracker-frontend, run:
```
yarn
yarn start
```

# Deployment

`./deploy`
- creates a production build / minified (not needed at this stage)

# Other notes
When configure Google Cloud Bucket to hold static files, make sure in the website configuration, 
set 404 page to index.html too. Otherwise you will get NoKey error when loading any page like /home,/admin, etc.

Vuexy React doc: https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/

# How to contribute

1. Create your own GitHub account
2. Fork the repository
3. Make changes and commit to your forked repository. The changes can be in main or any branches in your own fork.
4. Create Pull Request from your own fork to https://github.com/1thing-org/hatecrimetracker-frontend
5. Wait for reviewer to review and merge the PR

# Develop on MacBook with M1 Chip

1. Install HomeBrew:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
2. Use HomeBrew to install NodeJS V14
```
brew install node@14
```
3. Set PATH:
    * Open ~/.zshrc
    * Add the following lines and save:
```
export PATH=/opt/homebrew/bin:$PATH
export PATH="/opt/homebrew/opt/node@14/bin:$PATH"
```    
    * Make .zshrc executable
```
chmod +x ~/.zshrc
```
4. Install Yarn
```
npm install yarn
```
5. Make sure git is installed properly
    * Run git in a terminal, it might ask you to install Command Line Tools. Hit Install to install it.
6. Install XCode from AppStore
7. Install vscode
    * Go to https://code.visualstudio.com, download and install vscode.
    * Optionally install the following plugins:
        * React
        * Python
        * GitHub Copilot, need to sign in to GitHub when install
8. Clone repository
9. Build
    * Open a terminal, go to a hatecrimtracker-frontend folder
    * Run `yarn; yarn start`
