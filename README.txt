
'npm install'

'npm run start'
- produces a local server running on :3000

'npm run build' 
- creates a production build / minified (not needed at this stage)

##############
When configure Google Cloud Bucket to hold static files, make sure in the website configuration, 
set 404 page to index.html too. Otherwise you will get NoKey error when loading any page like /home,/admin, etc.