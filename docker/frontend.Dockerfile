# syntax=docker/dockerfile:1
# Builds both React SPAs and serves them with nginx:
#   :8081 -> frontend_auth     (account.mojprojekt.test)
#   :8082 -> frontend_resource (gym.mojprojekt.test)
# The build context is the repository root.

FROM node:24-alpine AS build-account
WORKDIR /app
COPY frontend_auth/package.json frontend_auth/yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn,sharing=locked yarn install --frozen-lockfile
COPY frontend_auth/ ./
RUN yarn build

FROM node:24-alpine AS build-gym
WORKDIR /app
COPY frontend_resource/package.json frontend_resource/yarn.lock frontend_resource/.yarnclean ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn,sharing=locked yarn install --frozen-lockfile
COPY frontend_resource/ ./
RUN yarn build

FROM nginx:1.29-alpine
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-account /app/dist /usr/share/nginx/account
COPY --from=build-gym /app/dist /usr/share/nginx/gym
EXPOSE 8081 8082
