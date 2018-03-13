FROM keymetrics/pm2:latest-alpine

# Bundle APP files
COPY src src/
COPY bin bin/
COPY package.json .
COPY pm2.json .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn

RUN npm install --production

RUN npm run reset

CMD [ "pm2-runtime", "start", "pm2.json" ]
