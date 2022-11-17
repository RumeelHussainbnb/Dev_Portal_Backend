FROM node:14

ENV DB_URL None
ENV DB_NAME None
ENV HOME_URL None
ENV BEARER_TOKEN None

WORKDIR /app
COPY . .
RUN npm --clean install

EXPOSE 3001

CMD [ "npm", "run", "start"]