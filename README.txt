# Dev Setup

1. Install NodeJS snf npm
    Follow instructiion at: https://nodejs.org/
2. Install Yarn
    `npm install --global yarn`
3. Install git (should already be installed on MacOSX)
4. Clone code from GitHub:
    `git clone https://github.com/lima01/hatecrimetracker-frontend.git`
5. Change configuration in hatecrimetracker-frontend/src/configs/appConfig.js
    `api_endpoint: 'https://api.hatecrimetracker.1thing.org'`
6. Under hatecrimetracker-frontend, run:
```
yarn
yarn start
```

# Deployment

'npm run build' 
- creates a production build / minified (not needed at this stage)

# Other notes
When configure Google Cloud Bucket to hold static files, make sure in the website configuration, 
set 404 page to index.html too. Otherwise you will get NoKey error when loading any page like /home,/admin, etc.

Vuexy React doc: https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/
