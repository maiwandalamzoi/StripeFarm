FROM node:12-alpine

COPY . /app
WORKDIR /app

RUN npm install --silent
RUN npm run build
RUN npm install -g serve

# start app
CMD ["serve", "-s", "build"]