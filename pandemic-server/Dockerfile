FROM node:14
WORKDIR /pandemic-server
COPY ./package.json ./package.json
RUN npm install
EXPOSE ${SERVER_PORT}
# Copy config, src, and public.
COPY ./tsconfig.json ./tsconfig.json
COPY ./src ./src
CMD ["npm", "run", "prod"]
