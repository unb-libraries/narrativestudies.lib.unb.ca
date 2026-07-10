FROM ghcr.io/unb-libraries/drupal:9.x-2.x-unblib

# Install additional OS packages.
ENV ADDITIONAL_OS_PACKAGES="postfix php7-ldap php7-redis"
ENV DRUPAL_SITE_ID="narrativ"
ENV DRUPAL_SITE_URI="narrativestudies.lib.unb.ca"
ENV DRUPAL_SITE_UUID="505198c5-b3da-4759-80ae-8f2bcfb469b5"

# Build application.
COPY ./build/ /build/
RUN ${RSYNC_MOVE} /build/scripts/container/ /scripts/ && \
  /scripts/addOsPackages.sh && \
  /scripts/initOpenLdap.sh && \
  /scripts/setupStandardConf.sh && \
  /scripts/build.sh

# Deploy configuration.
COPY ./config-yml ${DRUPAL_CONFIGURATION_DIR}
RUN /scripts/pre-init.d/72_secure_config_sync_dir.sh

# Deploy custom modules, themes.
COPY ./custom/themes ${DRUPAL_ROOT}/themes/custom
COPY ./custom/modules ${DRUPAL_ROOT}/modules/custom

# Container metadata.
LABEL ca.unb.lib.generator="drupal9" \
  org.opencontainers.image.title="narrativestudies.lib.unb.ca" \
  org.opencontainers.image.description="narrativestudies.lib.unb.ca a searchable bibliography of books, articles, and other resources that are relevant to narrative, directly or otherwise, in a broad range of disciplines and fields." \
  org.opencontainers.image.vendor="University of New Brunswick Libraries" \
  org.opencontainers.image.authors="UNB Libraries <libsupport@unb.ca>" \
  org.opencontainers.image.url="https://narrativestudies.lib.unb.ca" \
  org.opencontainers.image.source="https://github.com/unb-libraries/narrativestudies.lib.unb.ca" \
  org.opencontainers.image.version="$VERSION" \
  org.opencontainers.image.revision="$VCS_REF" \
  org.opencontainers.image.created="$BUILD_DATE"
