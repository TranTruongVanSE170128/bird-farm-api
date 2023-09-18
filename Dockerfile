FROM node:20

RUN npm i -g pnpm

ENV PORT 5000
ENV MONGODB_URI mongodb+srv://birdfarmswp:xCqboCDiIrnTuOLV@cluster0.fr2ft5v.mongodb.net/birdFarmDB
ENV NODEMAILER_USER birdfarmswp@gmail.com
ENV NODEMAILER_PASSWORD mngeorziuyhetrgk
ENV ACCESS_TOKEN_SECRET This is secret access token
ENV STRIPE_SECRET_KEY sk_test_51NrNnFINUTNxgE0XRIW9yfTjXc1aJkfYIVHQONcfbMtAvef0GXee1D7pO24lN1UrG7t0saYlGopoBpgbFSnPQz9e00SIfnW9uH 

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 8080
CMD ["pnpm","start"]
