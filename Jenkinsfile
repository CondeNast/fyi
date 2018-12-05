CnNodeBuild( project: "fyi", nodeVersion: "node-v6.14.4", npmVersion: "3.10.10" ) {
    sh "npm install"
    sh "npm run install:client"
    sh "npm run build:client:all"
    sh "rm .dockerignore"
}
