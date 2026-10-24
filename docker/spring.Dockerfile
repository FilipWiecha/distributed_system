# syntax=docker/dockerfile:1
# Shared multi-stage Dockerfile for all Spring Boot services
# (auth, gateway, queueclient, resource).
# Build context: repository root. Pick the module with --build-arg SERVICE=<dir>.

FROM maven:3.9-eclipse-temurin-25 AS build
ARG SERVICE
WORKDIR /workspace

# Download dependencies first so they are cached between source changes
COPY ${SERVICE}/pom.xml .
RUN --mount=type=cache,id=m2-${SERVICE},target=/root/.m2 mvn -B -q dependency:go-offline -DskipTests || true

COPY ${SERVICE}/src ./src
RUN --mount=type=cache,id=m2-${SERVICE},target=/root/.m2 mvn -B -q package -DskipTests \
    && cp target/*.jar /workspace/app.jar

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /workspace/app.jar app.jar
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError"
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
