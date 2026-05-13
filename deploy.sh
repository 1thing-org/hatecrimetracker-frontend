yarn build
gcloud config set project hate-crime-tracker
# Do not try -m for parallel deployment. It is not reliable and often stuck.
gsutil rm -r gs://hatecrimetracker/*
gsutil cp -R build/* gs://hatecrimetracker