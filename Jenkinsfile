pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        IMAGE_NAME    = 'taskflow-api'
        IMAGE_LATEST  = "${IMAGE_NAME}:latest"
        IMAGE_BUILD   = "${IMAGE_NAME}:build-${BUILD_NUMBER}"
        COMPOSE_FILE  = 'docker-compose.yml'
        APP_URL       = 'http://localhost'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh 'node --version && npm --version'
                sh 'npm ci'
            }
        }

        stage('Lint') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh 'npm test -- --ci'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true, fingerprint: false
                }
            }
        }

        stage('Build Docker') {
            steps {
                script {
                    def img = docker.build("${IMAGE_BUILD}", '--target production .')
                    img.tag('latest')
                }
                sh 'docker image ls | grep ${IMAGE_NAME} || true'
            }
        }

        stage('Deploy') {
            steps {
                // On relance UNIQUEMENT l'app, surtout pas le service jenkins
                // (sinon Jenkins se tuerait lui-même en plein build)
                sh 'docker compose -f ${COMPOSE_FILE} up -d --no-deps api mongodb nginx'
                sh 'docker compose -f ${COMPOSE_FILE} ps'
            }
        }
    }

    post {
        always {
            echo '─────────── Coverage résumé ───────────'
            sh '''
                if [ -f coverage/coverage-summary.json ]; then
                    cat coverage/coverage-summary.json
                elif [ -d coverage ]; then
                    ls -la coverage
                else
                    echo "Aucun rapport de couverture trouvé."
                fi
            '''
        }
        success {
            echo "✅ Build #${BUILD_NUMBER} réussi — TaskFlow API disponible sur ${APP_URL}"
        }
        failure {
            script {
                def failedStage = currentBuild.rawBuild?.getExecution()?.getCurrentHeads()?.collect { it.displayName }?.join(', ') ?: 'inconnu'
                echo "❌ Build #${BUILD_NUMBER} en échec (stage: ${failedStage}). Voir la console Jenkins."
            }
        }
    }
}
