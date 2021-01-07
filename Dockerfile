FROM node:12
#create working directory
WORKDIR /home/nodejs/app
#install app dependencies
COPY package*.json ./
RUN npm install
#bundle app source
COPY . .
#run command from starting point
CMD ["npm","start"]
