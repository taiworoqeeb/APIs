FROM node:16
WORKDIR C:\my filesz\Fresh\APIs\risevest-test


COPY package*.json ./


RUN npm install

COPY . . 

EXPOSE 3000 

CMD ["node", "app.js"]