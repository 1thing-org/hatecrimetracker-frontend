cp src/configs/config_prod.js src/configs/appConfig.js
yarn build
gcloud config set project hate-crime-tracker
# Do not try -m for parallel deployment. It is not reliable and often stuck.
gsutil rm -r gs://shortcode-tracker/*
gsutil cp -R build/* gs://shortcode-tracker
cp src/configs/config_dev.js src/configs/appConfig.js