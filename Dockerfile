FROM node:8
WORKDIR .
COPY package.json package.json  
RUN npm install  
COPY . .
RUN npm --prefix public/frontend install
RUN npm --prefix public/frontend run build
EXPOSE 3000
CMD [ "npm", "start" ]
