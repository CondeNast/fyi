FROM node:8
WORKDIR .
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run install:client
RUN npm run build:client
RUN git clone https://github.com/vishnubob/wait-for-it.git
EXPOSE 3000
CMD [ "npm", "start" ]
