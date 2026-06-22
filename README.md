# TaskFlow API

API REST de gestion de tâches — Projet final CI/CD (Jenkins + Docker).

> Repo : `projet-final-cicd` · Stack : Node.js, Express, MongoDB, Docker, Nginx, Jenkins

## Description

TaskFlow API permet de créer, lister, mettre à jour et supprimer des tâches via une API REST.
Ce projet industrialise l'application avec Docker Compose et un pipeline Jenkins automatisé.

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) et Docker Compose
- [Node.js 18+](https://nodejs.org/) (développement local uniquement)
- [Git](https://git-scm.com/)

## Démarrage rapide

```bash
git clone https://github.com/ClementLmd/projet-final-cicd.git
cd projet-final-cicd
cp .env.example .env
docker compose up -d --build
curl http://localhost/api/tasks
```

## Variables d'environnement

| Variable      | Description                          | Exemple                              |
|---------------|--------------------------------------|--------------------------------------|
| `PORT`        | Port interne de l'API                  | `5000`                               |
| `MONGO_URI`   | URI de connexion MongoDB               | `mongodb://mongodb:27017/taskflow`   |
| `APP_VERSION` | Version affichée dans `/health`        | `1.0.0`                              |

Copier `.env.example` vers `.env` avant le premier lancement.

## Structure du projet

```
projet-final-cicd/
├── src/
│   ├── app.js          # Configuration Express
│   ├── server.js       # Point d'entrée
│   ├── config/         # Connexion MongoDB
│   ├── models/         # Modèle Task
│   └── routes/         # Routes REST + /health
├── tests/              # Tests Jest
├── nginx/              # Config reverse proxy (Dev 2)
├── Dockerfile          # Image API multi-stage (Dev 2)
├── docker-compose.yml  # Stack complète (Dev 2)
├── Jenkinsfile         # Pipeline CI/CD (Dev 2)
├── package.json
├── .env.example
└── README.md
```

## Conventions binôme

| Sujet              | Valeur convenue                              |
|--------------------|----------------------------------------------|
| Port API           | `5000` (interne, non exposé à l'hôte)        |
| Service MongoDB    | `mongodb` (nom du service dans Compose)      |
| Base de données    | `taskflow`                                   |
| `MONGO_URI`        | `mongodb://mongodb:27017/taskflow`           |
| Point d'entrée     | Nginx sur le port `80` uniquement            |
| Scripts npm        | `start`, `test`, `lint`                        |
| Branche principale | `main`                                       |
| Commits            | Conventionnels (`feat:`, `fix:`, `ci:`, …)    |

## Répartition des tâches

| Tâche                         | Dev 1 | Dev 2 |
|-------------------------------|:-----:|:-----:|
| Application Express + routes  | ✅    |       |
| Tests Jest + ESLint           | ✅    |       |
| Dockerfile + Compose + Nginx  |       | ✅    |
| Jenkinsfile + webhook         |       | ✅    |

## Architecture du pipeline

```
Checkout → Install → Lint → Test → Build Docker → Deploy
```

_(Schéma détaillé à compléter par Dev 2)_

## Licence

MIT
