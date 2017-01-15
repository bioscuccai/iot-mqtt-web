FROM node
RUN mkdir -p /usr/src/
WORKDIR /usr/src/app
COPY *.js /usr/src/app/
COPY *.json /usr/src/app/
COPY .env /usr/src/app/
COPY routes /usr/src/app/routes
COPY templates /usr/src/app/templates
COPY static /usr/src/app/static
COPY .bowerrc /usr/src/app/


RUN npm i bower -g
RUN npm i pm2 -g
RUN npm i
RUN bower install --allow-root --force-latest

EXPOSE 5000
EXPOSE 3008
EXPOSE 1883
CMD ["pm2", "start", "index.js", "--no-daemon"]
