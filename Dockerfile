FROM node:8
WORKDIR .
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run install:client
RUN npm run build:client
EXPOSE 3000
CMD [ "npm", "start" ]
