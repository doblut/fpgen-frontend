FROM node:16

COPY createUsers.sh ./
RUN ./createUsers.sh \
	&& rm createUsers.sh

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g serve
RUN apt-get update \
	&& apt-get -y install nano vim curl

COPY . .

RUN cd /app
RUN npm run build

EXPOSE 5005
CMD [ "serve", "-l", "5005", "-s", "build" ]