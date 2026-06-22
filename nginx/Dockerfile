# Image Nginx avec la conf reverse proxy de TaskFlow embarquee.
# Empaqueter la conf evite de bind-mounter ./nginx/nginx.conf, ce qui
# poserait probleme quand le pipeline Jenkins lance docker compose
# depuis l'interieur d'un conteneur (chemin host vs chemin Jenkins).

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
