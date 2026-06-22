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
| Modèle Task + connexion Mongo | ✅    |       |
| Tests Jest (mongodb-memory)   | ✅    |       |
| Configuration ESLint          | ✅    |       |
| Dockerfile multi-stage        |       | ✅    |
| nginx.conf (reverse proxy)    |       | ✅    |
| docker-compose.yml            |       | ✅    |
| Service Jenkins dans Compose  |       | ✅    |
| Jenkinsfile (6 stages + post) |       | ✅    |
| Webhook GitHub                |       | ✅    |
| README                        | ✅    | ✅    |

## Architecture du pipeline

```
┌──────────┐   ┌─────────┐   ┌──────┐   ┌──────┐   ┌──────────────┐   ┌─────────┐
│ Checkout │ → │ Install │ → │ Lint │ → │ Test │ → │ Build Docker │ → │ Deploy  │
│   (scm)  │   │ npm ci  │   │ npm  │   │ npm  │   │  :latest +   │   │ docker  │
│          │   │         │   │ run  │   │ test │   │  :build-N    │   │ compose │
│          │   │         │   │ lint │   │      │   │              │   │  up -d  │
└──────────┘   └─────────┘   └──────┘   └──────┘   └──────────────┘   └─────────┘
                  └────────── node:18-alpine ──────────┘
```

Les stages `Install`, `Lint` et `Test` s'exécutent dans un conteneur
`node:18-alpine` (via `agent { docker { ... reuseNode true } }`), ce qui évite
d'avoir à installer Node.js dans le conteneur Jenkins lui-même.
Les stages `Build Docker` et `Deploy` utilisent le `docker.sock` monté dans le
conteneur Jenkins. Le `Deploy` relance uniquement `api`, `mongodb` et `nginx`
— jamais Jenkins, sous peine de se tuer lui-même en plein build.

## Mise en place de Jenkins

### 1. Démarrer Jenkins avec le reste de la stack

```bash
docker compose up -d jenkins
docker compose logs -f jenkins   # repérer le mot de passe initial
```

Le mot de passe initial s'affiche dans les logs, encadré par des `*****`, ou
peut être récupéré via :

```bash
docker compose exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Ouvrir [http://localhost:8080](http://localhost:8080) puis suivre l'assistant.

### 2. Plugins à installer

Au moment du choix initial, cocher « Install suggested plugins », puis vérifier
que les plugins suivants sont bien présents (sinon les ajouter manuellement) :

- **Git** — récupération du code depuis GitHub
- **Pipeline** — exécution de pipelines déclaratifs
- **Docker Pipeline** — pour `docker.build`, `docker.image(...).inside { ... }`

### 3. Créer le job pipeline

1. Dashboard → **New Item** → **Pipeline** → nom : `taskflow-api`.
2. Section *Build Triggers* : cocher **GitHub hook trigger for GITScm polling**.
3. Section *Pipeline* :
   - Definition : **Pipeline script from SCM**
   - SCM : **Git**
   - Repository URL : URL HTTPS du repo GitHub
   - Branch : `*/main`
   - Script Path : `Jenkinsfile`
4. **Save** puis **Build Now** pour vérifier que les 6 stages passent au vert.

### 4. Webhook GitHub

Sur le repo GitHub :

1. *Settings* → *Webhooks* → *Add webhook*
2. Payload URL : `http://<host-jenkins>:8080/github-webhook/`
3. Content type : `application/json`
4. Event : *Just the push event*
5. Active : ✅

> En local, exposer Jenkins via [ngrok](https://ngrok.com/) ou équivalent si
> GitHub doit pouvoir l'appeler depuis Internet.

## Licence

MIT
