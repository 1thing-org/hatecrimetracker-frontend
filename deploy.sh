cp src/config_prod.js src/config.js
yarn build
gcloud config set project hatecrimetracker-2021
gsutil cp -R dist/* gs://hatecrimetracker.1-thing.org
cp src/config_dev.js src/config.js