FROM node:19-bullseye-slim

RUN apt-get update

WORKDIR /Frontend
COPY package-lock.json package.json /Frontend/
RUN cd /Frontend/ && npm i

COPY . . 

EXPOSE 3000

CMD [ "npm", "start" ]