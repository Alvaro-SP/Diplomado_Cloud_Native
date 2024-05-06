FROM node:18.17-alpine as build

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]

# sudo docker build -t alvarosp24/sa_frontend . --no-cache --force-rm
# sudo docker push alvarosp24/sa_frontend

# sudo docker run -p 5173:5173 alvarosp24/sa_frontend

