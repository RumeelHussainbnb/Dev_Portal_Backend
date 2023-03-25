FROM node:18-alpine

ENV DB_URL DB_NAME HOME_URL BEARER_TOKEN PORT Amazon_S3_region Amazon_S3_Bucket_Name Amazon_S3_Access_Key_ID Amazon_S3_Secret_Access_Key

WORKDIR /app
COPY . .

RUN npm --clean install

EXPOSE 3001

CMD [ "npm", "run", "start:server"]