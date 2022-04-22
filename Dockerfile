FROM node:16

# Папка приложения
ARG APP_DIR=/app

RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

RUN npm ci backend

# Bundle app source
EXPOSE 3000
CMD [ "ping", "localhost"]
