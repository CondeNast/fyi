CnNodeBuild( project: "easy-fyi", nodeVersion: "nsolid-2.4.1-carbon", npmVersion: "3.10.10" ) {
    sh "npm install"
    sh "npm run install:client"
    sh "npm run build:client:all"
    sh "rm .dockerignore"
}
