FROM node:18-alpine

ENV DB_URL None
ENV DB_NAME None
ENV HOME_URL None
ENV BEARER_TOKEN None
ENV PORT None

WORKDIR /app
COPY . .

RUN npm --clean install

EXPOSE 4001

CMD [ "npm", "run", "start:server"]