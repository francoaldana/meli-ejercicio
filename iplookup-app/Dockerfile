# base image
FROM node:10.15.0

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
RUN npm install --silent
RUN npm install react-scripts -g --silent

# start app
CMD ["npm", "start"]
