# Stage 1: Build the application using Maven and Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the pom.xml and all source files into the container
COPY . .

# Compile and package the code into a runnable .jar file, skipping tests for a faster build
RUN ./mvnw clean package -DskipTests

# Stage 2: Create a lightweight runtime container
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy only the compiled .jar file from the build stage into this clean runtime environment
COPY --from=build /app/target/*.jar app.jar

# Inform Docker that the container listens on port 8080 at runtime
EXPOSE 8080

# Execute the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]