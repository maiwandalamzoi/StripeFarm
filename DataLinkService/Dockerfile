FROM node:12.2.0-alpine

COPY . /app
WORKDIR /app

RUN npm install --silent
#RUN npm run dev
#RUN npm install -g serve

# start app
#CMD ["serve", "-s", "build"]
CMD ["npm", "run", "dev"]