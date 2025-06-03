Africa CDC HIEMAT Backend APIs

Overview
The HIEMAT platform, developed by Africa CDC, is a backend API built with NestJS and PostgreSQL. It enables countries to evaluate and improve health data exchange systems by managing users, roles, permissions, assessments, roadmaps, and more. The API provides a secure, scalable foundation for health information exchange.

Key features:

User authentication and role-based access control (RBAC).
Management of assessments, domains, components, and sub-components.
Roadmap creation for health data exchange improvements.
Swagger-based API documentation for easy integration.

Prerequisites

Node.js (v20.16.0 or later)
Yarn (v1.x)
Docker (for PostgreSQL)
PostgreSQL (v14 or later)

Setup

Clone the Repository:
cd apis


Install Dependencies:
yarn install


Configure Environment:Copy the example environment file and update it with your settings:
cp .env.example .env

Edit .env to set:

DATABASE_HOST, DATABASE_PORT, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME
DATABASE_SYNCHRONIZE=false (recommended for production)
APP_PORT, APP_API_PREFIX


Start PostgreSQL with Docker:
yarn docker:up


Run Database Migrations:
yarn migration:run


Seed the Database (optional):
yarn db:seed


Start the Application:

Development (with hot-reload):yarn dev


Production:yarn build
yarn start:prod


API Documentation
The API is documented using Swagger. Access it at:
http://localhost:<APP_PORT>/docs


Title: HIEMAT API

Description: Manages users, roles, assessments, and roadmaps for health information exchange.
Authentication: Bearer token-based.

Scripts

Build and Run:

yarn build: Compile TypeScript to JavaScript.
yarn start: Run the compiled app.
yarn dev: Run in development with watch mode.
yarn start:prod: Run in production.


Database:

yarn migration:generate: Generate a new migration.
yarn migration:create: Create an empty migration file.
yarn migration:run: Apply migrations.
yarn migration:show: List applied migrations.
yarn migration:revert: Revert the last migration.
yarn db:seed: Run database seeders.


Docker:

yarn docker:up: Start PostgreSQL container.
yarn docker:down: Stop and remove container.
yarn docker:logs: View container logs.