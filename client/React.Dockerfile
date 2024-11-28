FROM node:lts-alpine AS build
WORKDIR /usr/local/app

EXPOSE 5173
COPY package.json ./
COPY .eslintrc.cjs vite.config.js index.html ./
COPY tailwind.config.js jsconfig.json postcss.config.js ./
COPY public ./public
COPY src ./src

RUN yarn install
RUN yarn global add serve
RUN npm run build

ENTRYPOINT [ "serve","-s","-p","5173","dist" ]
