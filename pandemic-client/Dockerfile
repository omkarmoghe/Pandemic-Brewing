FROM node:14
WORKDIR /pandemic-client
# Copy config, src, and public.
COPY ./tsconfig.json ./tsconfig.json
COPY ./src ./src
COPY ./public ./public
COPY ./package.json ./package.json
RUN npm install
RUN npm run build
EXPOSE ${CLIENT_PORT}
CMD ["serve", "-s", "build", "-l", "${CLIENT_PORT}"]
