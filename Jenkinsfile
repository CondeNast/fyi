CnNodeBuild( project: "fyi", nodeVersion: "node-v8.11.3", npmVersion: "5.6.0" ) {
    sh "npm install --unsafe-perm"
    sh "npm run install:client"
    sh "npm run build:client:all"
    sh "rm .dockerignore"
}
