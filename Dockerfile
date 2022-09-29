FROM node:16

COPY createUsers.sh ./
RUN ./createUsers.sh \
	&& rm createUsers.sh

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN apt-get update \
	&& apt-get -y install nano vim curl

COPY . .

EXPOSE 5002
CMD [ "node", "index.js" ]