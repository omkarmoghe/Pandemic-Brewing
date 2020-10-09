FROM node:14
WORKDIR /pandemic-client
# Copy config, src, and public.
COPY ./public ./public
COPY ./tsconfig.json ./tsconfig.json
COPY ./src ./src
COPY ./package.json ./package.json
RUN npm install
RUN npm install -g serve
RUN npm run build
COPY ./public ./build/public
EXPOSE ${CLIENT_PORT}
CMD ["serve", "-s", "build", "-d"]
