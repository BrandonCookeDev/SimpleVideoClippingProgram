FROM node:8

ENV APP_DIR /app/current/
WORKDIR ${APP_DIR}

COPY . .

RUN npm i --production

CMD ["npm", "start"]