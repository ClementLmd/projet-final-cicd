# Jenkins controller avec le CLI Docker et docker compose v2.
# Necessaire pour les pipelines qui utilisent docker.image(...).inside { ... }
# et pour les stages Build Docker / Deploy du Jenkinsfile.

FROM jenkins/jenkins:lts-jdk17

USER root

# Pre-requis pour ajouter le depot officiel Docker (Debian)
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gnupg \
 && install -m 0755 -d /etc/apt/keyrings \
 && curl -fsSL https://download.docker.com/linux/debian/gpg \
        -o /etc/apt/keyrings/docker.asc \
 && chmod a+r /etc/apt/keyrings/docker.asc \
 && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
          https://download.docker.com/linux/debian \
          $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
        > /etc/apt/sources.list.d/docker.list \
 && apt-get update \
 && apt-get install -y --no-install-recommends \
        docker-ce-cli \
        docker-compose-plugin \
 && rm -rf /var/lib/apt/lists/*

# On reste en root pour pouvoir lire/ecrire le docker.sock monte depuis l'hote
# sans avoir a aligner le GID 'docker' entre Windows/macOS/Linux.
USER root
