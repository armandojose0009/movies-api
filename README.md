# 🎬 Movies API - Cinema Reservation Management System

Backend system built with NestJS and PostgreSQL to manage movie reservations in cinema theaters.

## 📋 Features

- ✅ Complete CRUD for movies
- ✅ Complete CRUD for cinema theaters
- ✅ Showtime management with validations
- ✅ Ticket purchasing system with capacity control
- ✅ Future date validation for showtimes
- ✅ Seat overselling prevention
- ✅ Automatic Swagger documentation
- ✅ Database migrations
- ✅ Test data seeding script
- ✅ Complete Dockerization
- ✅ Environment-based configuration

## 🏗️ Architecture and Technical Decisions

### Project Structure

```
src/
├── common/          # Shared constants and utilities
├── config/          # Database configuration
├── entities/        # TypeORM entities
├── movies/          # Movies module
├── cinemas/         # Cinema theaters module
├── showtimes/       # Showtimes module
├── tickets/         # Tickets module
└── database/        # Migrations and seeds
```

### Architecture Decisions

1. **Domain-based Modules**: Each entity has its own module with controller, service, and DTOs
2. **Layered Validations**:
   - DTOs with class-validator for input validation
   - Business logic in services
   - Database constraints for data integrity
3. **TypeORM Relations**: Foreign keys and relationships for referential integrity
4. **Separation of Concerns**: Controllers handle HTTP only, services contain business logic
5. **Centralized Messages**: All error and success messages in constants file

### Libraries Used

- **NestJS**: Main framework for its modular architecture and decorators
- **TypeORM**: Robust ORM with full PostgreSQL support
- **class-validator**: Declarative DTO validation
- **Swagger**: Automatic API documentation
- **PostgreSQL**: Relational database for data integrity

### Trade-offs

- **Sync vs Migrations**: Uses `synchronize: true` in development for speed, migrations in production
- **Duplicate Validation**: Validations in both DTOs and services for robustness
- **Eager vs Lazy Relations**: Relations loaded explicitly for performance control

## 🚀 Installation and Setup

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (if not using Docker)

### Environment Configuration

**IMPORTANT**: Both Docker and local setup require environment variables configuration.

1. **Copy environment template**

```bash
cp .env.example .env
```

2. **Edit .env file with your settings**

```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=movies_user
DB_PASSWORD=movies_pass
DB_DATABASE=movies_db
```

### Option 1: With Docker (Recommended)

1. **Clone repository**

```bash
git clone <repository-url>
cd movies-api
```

2. **Configure environment**

```bash
cp .env.example .env
# Edit .env with your database settings
```

3. **Start with Docker Compose**

```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`

**Note**: Docker Compose automatically reads variables from `.env` file for both the application and PostgreSQL container.

### Option 2: Local Installation

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment variables**

```bash
cp .env.example .env
# Edit .env with your database configurations
```

3. **Run migrations**

```bash
npm run migration:run
```

4. **Load test data (optional)**

```bash
npm run seed
```

5. **Start application**

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📚 API Documentation

Once the application is running, interactive Swagger documentation will be available at:

**🔗 http://localhost:3000/api**

### Main Endpoints

#### Movies

- `GET /movies` - List all movies
- `POST /movies` - Create new movie
- `GET /movies/:id` - Get movie by ID
- `PATCH /movies/:id` - Update movie
- `DELETE /movies/:id` - Delete movie

#### Cinema Theaters

- `GET /cinemas` - List all cinema theaters
- `POST /cinemas` - Create new cinema theater
- `GET /cinemas/:id` - Get cinema theater by ID
- `PATCH /cinemas/:id` - Update cinema theater
- `DELETE /cinemas/:id` - Delete cinema theater

#### Showtimes

- `GET /showtimes` - List all showtimes
- `POST /showtimes` - Create new showtime
- `GET /showtimes/:id` - Get showtime by ID
- `GET /showtimes/:id/available-seats` - Get available seats
- `PATCH /showtimes/:id` - Update showtime
- `DELETE /showtimes/:id` - Delete showtime

#### Tickets

- `GET /tickets` - List all tickets
- `POST /tickets` - Purchase ticket
- `GET /tickets/:id` - Get ticket by ID
- `GET /tickets/showtime/:showtimeId` - Get tickets by showtime
- `DELETE /tickets/:id` - Cancel ticket

## 🧪 Testing

```bash
# Unit tests
npm run test

# Tests with coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Tests in watch mode
npm run test:watch
```

## 🗄️ Database

### Migrations

```bash
# Generate new migration
npm run migration:generate -- src/database/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

### Test Data

```bash
# Load test data
npm run seed
```

The seed script creates:

- 3 sample movies
- 3 cinema theaters with different capacities
- 3 showtimes scheduled for future dates

## 🔒 Implemented Validations

### Showtimes

- ❌ Cannot create showtimes in the past
- ✅ Movie and cinema theater existence validation
- ✅ Date format and price validation

### Tickets

- ❌ Cannot exceed cinema theater capacity
- ❌ Cannot occupy the same seat twice
- ✅ Customer data validation
- ✅ Showtime existence validation

## 🐳 Docker

### Development

```bash
# Configure environment first
cp .env.example .env
# Edit .env with your settings

# Start with Docker Compose
docker-compose up --build
```

### Production

```bash
docker-compose -f docker-compose.prod.yml up --build
```

**Important**: Docker Compose reads configuration from `.env` file automatically. Make sure to configure your environment variables before running Docker commands.

## 📝 Usage Examples

### Create a movie

```bash
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Avengers: Endgame",
    "description": "The Avengers assemble to defeat Thanos",
    "duration": 181,
    "genre": "Superhero",
    "rating": "PG-13"
  }'
```

### Create a showtime

```bash
curl -X POST http://localhost:3000/showtimes \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": 1,
    "cinemaId": 1,
    "startTime": "2024-12-25T19:30:00Z",
    "price": 25.50
  }'
```

### Purchase a ticket

```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "showtimeId": 1,
    "customerName": "John Doe",
    "customerEmail": "john@email.com",
    "seatNumber": "A1"
  }'
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
DB_HOST=your-postgres-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=movies_db
```

### Environment Configuration Notes

- **Local Development**: Configure `.env` file with your local database settings
- **Docker**: Docker Compose automatically uses variables from `.env` file
- **Production**: Set environment variables in your deployment platform
- **Security**: Never commit `.env` file to version control (already in .gitignore)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Developed by Armando Jose Peña Mujica** 🎬
