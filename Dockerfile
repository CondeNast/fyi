FROM node:8
WORKDIR /app
COPY package.json /app/package.json
COPY config/ /app/config/
COPY src/scripts/ /app/src/scripts/
COPY src/frontend/ /app/src/frontend/
COPY public/frontend/ /app/public/frontend/
RUN npm install
RUN npm run install:client
RUN npm run build:client:all
COPY . .
RUN git clone https://github.com/vishnubob/wait-for-it.git
EXPOSE 3000
CMD [ "npm", "run", "dev"]
