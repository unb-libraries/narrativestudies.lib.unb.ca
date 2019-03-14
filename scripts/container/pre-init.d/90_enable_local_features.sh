#!/usr/bin/env sh
DRUSH_COMMAND="drush --root=${DRUPAL_ROOT} --uri=default --yes"

mkdir -p /app/html/libraries
ln -sf /app/html/vendor/ckeditor/ckeditor /app/html/libraries/
