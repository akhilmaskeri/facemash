FROM node:10

WORKDIR /app

COPY package*.json /app
COPY index.js /app/index.js
COPY src /app/src

RUN npm install

CMD ["node", "seed.js"]

ENTRYPOINT ["node", "index.js"]