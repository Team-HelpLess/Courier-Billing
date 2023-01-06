FROM node:19-bullseye-slim

RUN apt-get update

WORKDIR /Frontend
COPY package-lock.json package.json /Frontend/
RUN cd /Frontend/ && npm install vite && npm i
COPY . . 

EXPOSE 5173

CMD [ "npm", "run", "dev"]