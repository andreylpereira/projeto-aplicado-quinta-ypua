
FROM maven:3-eclipse-temurin-17 AS build

COPY . /app

WORKDIR /app

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-alpine

COPY --from=build /app/target/api-0.0.1.jar /app/demo.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/demo.jar"]