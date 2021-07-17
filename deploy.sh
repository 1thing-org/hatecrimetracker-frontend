cp src/config_prod.js src/config.js
yarn build
gcloud config set project hate-crime-tracker
gsutil cp -R dist/* gs://hatecrimetracker
cp src/config_dev.js src/config.js