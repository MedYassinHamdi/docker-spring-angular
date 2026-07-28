# docker-spring-angular

A full-stack reference project built to demonstrate practical, hands-on containerization of a modern Spring Boot and Angular application — from a bare Docker install to a fully orchestrated multi-container stack.

This repository is a learning-focused, from-first-principles exploration of Docker and CI/CD fundamentals: image and container lifecycle, multi-stage builds, container networking, service discovery, environment-based configuration, multi-service orchestration with Docker Compose, and automated build/deployment pipelines — applied to a realistic backend and frontend architecture rather than a toy example.

## Purpose

Most Docker tutorials stop at "here is a Dockerfile." This project goes further: it containerizes a complete application with a relational database, file storage, and a service-oriented backend architecture, then wires it into an automated CI/CD pipeline — and documents the reasoning behind each configuration decision, not just the commands.

The goal is to build genuine, transferable understanding of how containerized applications are built, tested, and shipped in practice, as a foundation for further work with Kubernetes.

## Tech Stack

**Backend**
- Java 25
- Spring Boot
- Spring Data JPA / Hibernate
- Spring Web
- Spring Boot Validation
- Lombok
- MySQL

**Frontend**
- Angular

**Infrastructure**
- Docker
- Docker Compose
- MySQL (containerized)

## Architecture

The application follows a layered, service-oriented backend architecture:

```
Controller → Service (interface) → Service Implementation → Repository → Entity
```

Data Transfer Objects (DTOs) are used at API boundaries where request/response shaping matters — keeping persistence entities decoupled from what is exposed over HTTP.

### Domain Model

The backend implements a small e-commerce domain to provide realistic, related data rather than a single isolated entity:

- **User** — application users, with role-based access via a `Role` enum (`ROLE_USER`, `ROLE_ADMIN`)
- **Category** — product categories
- **Product** — includes optional image upload, handled through a dedicated file storage service
- **Order** / **OrderItem** — orders with line items and price snapshots at time of purchase
- **Review** — user reviews linked to products
- **Address** — user shipping addresses

### Image Upload

Product images are handled through a dedicated `FileStorageService`, with the storage directory externalized via environment configuration so the same code path works identically whether running locally or inside a container with a mounted volume.

## Containerization Approach

Each part of the stack is containerized independently, using the pattern appropriate to its runtime:

- **Backend** — multi-stage Docker build: a build stage with the full JDK and Maven compiles the application, and a second, minimal stage running only a JRE serves the final artifact. This keeps the production image lean by excluding build tooling and source code from the final layer.
- **Frontend** — built as static assets and served through a lightweight web server, rather than shipping a Node runtime in production.
- **Database** — MySQL runs as its own container rather than a host-installed dependency, making the entire stack portable and reproducible on any machine with Docker installed.

All configuration (database credentials, connection URLs, upload paths, ports) is externalized through environment variables with sensible local defaults, following twelve-factor app conventions — the same codebase runs unmodified locally, in Docker Compose, or in a future orchestrated environment such as Kubernetes.

### Orchestration

`docker-compose.yml` defines the backend, frontend, and database as a single unit, with the backend resolving the database by service name over Docker's internal network rather than through `localhost` or host-machine bridging — the correct pattern for multi-container communication.

## CI/CD

A GitHub Actions pipeline automates the build and validation process on every push:

- Compiles and runs backend and frontend builds in isolated, reproducible environments
- Builds Docker images for each service using the same multi-stage Dockerfiles used locally, ensuring parity between CI and local development
- Pushes tagged images to a container registry on successful builds to main

The pipeline is intentionally kept close to the local Docker workflow — the same Dockerfiles, the same build commands — so that what passes in CI is exactly what runs locally, with no environment-specific drift.

## Running the Project

```bash
git clone https://github.com/MedYassinHamdi/docker-spring-angular.git
cd docker-spring-angular
docker compose up --build
```

This builds and starts the full stack — backend, frontend, and database — with no manual database setup, dependency installation, or environment configuration required beyond having Docker installed.

## Project Structure

```
docker-spring-angular/
├── backend-docker/          Spring Boot application
├── frontend-docker/         Angular application
├── docker-compose.yml       Multi-container orchestration
└── .github/workflows/       CI/CD pipeline definitions
```

## Roadmap

- Spring Security with JWT authentication and role-based authorization
- Docker volume persistence for the database and uploaded images
- Kubernetes deployment (Pods, Deployments, Services, Ingress)
- Automated deployment stage on top of the existing CI build pipeline

## Author

Mohamed Yassin Hamdi
Full-Stack Software Engineer — Java/Spring Boot, Angular, React
[LinkedIn](https://linkedin.com/in/yassin-hamdi) · [GitHub](https://github.com/MedYassinHamdi)
