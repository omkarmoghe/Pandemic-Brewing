FROM node:14
WORKDIR /pandemic-server
COPY ./package.json ./package.json
RUN npm install
EXPOSE 8337
# Copy config, src, and public.
COPY ./tsconfig.json ./tsconfig.json
COPY ./src ./src
COPY ./public ./public
CMD ["npm", "run", "prod"]
