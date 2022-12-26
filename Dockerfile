FROM node:18-alpine

WORKDIR /
COPY package*.json .
RUN npm install
RUN npm install -g typescript

# build libs
COPY ./lib/type ./lib/type
RUN ["npm", "run", "docker:prebuild"]
COPY ./lib/type/dist ./lib/type/dist

COPY ./app/backend ./app/backend

# update dependencies for backend
COPY app/backend/package*.json app/backend
WORKDIR /app/backend
RUN npm install
WORKDIR /

# build backend
RUN ["npm", "run", "docker:build"]
COPY ./app/backend/dist ./app/backend/dist

EXPOSE 8080
CMD ["npm", "run", "backend:start"]