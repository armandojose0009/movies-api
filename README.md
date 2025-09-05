# 🎬 Movies API - Sistema de Gestión de Reservas de Cine

Sistema backend desarrollado con NestJS y PostgreSQL para gestionar reservas de películas en salas de cine.

## 📋 Características

- ✅ CRUD completo de películas
- ✅ CRUD completo de salas de cine
- ✅ Gestión de funciones (showtimes) con validaciones
- ✅ Sistema de compra de tickets con control de capacidad
- ✅ Validación de fechas futuras para funciones
- ✅ Prevención de sobreventa de asientos
- ✅ Documentación automática con Swagger
- ✅ Migraciones de base de datos
- ✅ Script de datos de prueba (seed)
- ✅ Dockerización completa

## 🏗️ Arquitectura y Decisiones Técnicas

### Estructura del Proyecto
```
src/
├── config/          # Configuración de base de datos
├── entities/        # Entidades TypeORM
├── movies/          # Módulo de películas
├── cinemas/         # Módulo de salas de cine
├── showtimes/       # Módulo de funciones
├── tickets/         # Módulo de tickets
└── database/        # Migraciones y seeds
```

### Decisiones de Arquitectura

1. **Modular por Dominio**: Cada entidad tiene su propio módulo con controlador, servicio y DTOs
2. **Validaciones en Capas**: 
   - DTOs con class-validator para validación de entrada
   - Lógica de negocio en servicios
   - Constraints de base de datos para integridad
3. **Relaciones TypeORM**: Uso de foreign keys y relaciones para mantener integridad referencial
4. **Separación de Responsabilidades**: Controladores solo manejan HTTP, servicios contienen lógica de negocio

### Librerías Utilizadas

- **NestJS**: Framework principal por su arquitectura modular y decoradores
- **TypeORM**: ORM robusto con soporte completo para PostgreSQL
- **class-validator**: Validación declarativa de DTOs
- **Swagger**: Documentación automática de API
- **PostgreSQL**: Base de datos relacional para integridad de datos

### Trade-offs

- **Sincronización vs Migraciones**: Se usa `synchronize: true` en desarrollo para rapidez, migraciones en producción
- **Validación Duplicada**: Validaciones tanto en DTOs como en servicios para robustez
- **Relaciones Eager vs Lazy**: Se cargan relaciones explícitamente para control de performance

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- Docker y Docker Compose
- PostgreSQL (si no usas Docker)

### Opción 1: Con Docker (Recomendado)

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd movies-api
```

2. **Levantar con Docker Compose**
```bash
docker-compose up --build
```

La aplicación estará disponible en `http://localhost:3000`

### Opción 2: Instalación Local

1. **Instalar dependencias**
```bash
npm install
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones de base de datos
```

3. **Ejecutar migraciones**
```bash
npm run migration:run
```

4. **Cargar datos de prueba (opcional)**
```bash
npm run seed
```

5. **Iniciar la aplicación**
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 📚 Documentación de API

Una vez que la aplicación esté ejecutándose, la documentación interactiva de Swagger estará disponible en:

**🔗 http://localhost:3000/api**

### Endpoints Principales

#### Películas
- `GET /movies` - Listar todas las películas
- `POST /movies` - Crear nueva película
- `GET /movies/:id` - Obtener película por ID
- `PATCH /movies/:id` - Actualizar película
- `DELETE /movies/:id` - Eliminar película

#### Salas de Cine
- `GET /cinemas` - Listar todas las salas
- `POST /cinemas` - Crear nueva sala
- `GET /cinemas/:id` - Obtener sala por ID
- `PATCH /cinemas/:id` - Actualizar sala
- `DELETE /cinemas/:id` - Eliminar sala

#### Funciones
- `GET /showtimes` - Listar todas las funciones
- `POST /showtimes` - Crear nueva función
- `GET /showtimes/:id` - Obtener función por ID
- `GET /showtimes/:id/available-seats` - Asientos disponibles
- `PATCH /showtimes/:id` - Actualizar función
- `DELETE /showtimes/:id` - Eliminar función

#### Tickets
- `GET /tickets` - Listar todos los tickets
- `POST /tickets` - Comprar ticket
- `GET /tickets/:id` - Obtener ticket por ID
- `GET /tickets/showtime/:showtimeId` - Tickets por función
- `DELETE /tickets/:id` - Cancelar ticket

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:cov

# Tests e2e
npm run test:e2e

# Tests en modo watch
npm run test:watch
```

## 🗄️ Base de Datos

### Migraciones

```bash
# Generar nueva migración
npm run migration:generate -- src/database/migrations/MigrationName

# Ejecutar migraciones
npm run migration:run

# Revertir última migración
npm run migration:revert
```

### Datos de Prueba

```bash
# Cargar datos de prueba
npm run seed
```

El script de seed crea:
- 3 películas de ejemplo
- 3 salas de cine con diferentes capacidades
- 3 funciones programadas para fechas futuras

## 🔒 Validaciones Implementadas

### Funciones (Showtimes)
- ❌ No se pueden crear funciones en el pasado
- ✅ Validación de existencia de película y sala
- ✅ Validación de formato de fecha y precio

### Tickets
- ❌ No se puede superar la capacidad de la sala
- ❌ No se puede ocupar el mismo asiento dos veces
- ✅ Validación de datos del cliente
- ✅ Validación de existencia de la función

## 🐳 Docker

### Desarrollo
```bash
docker-compose up --build
```

### Producción
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## 📝 Ejemplos de Uso

### Crear una película
```bash
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Avengers: Endgame",
    "description": "Los Vengadores se unen para derrotar a Thanos",
    "duration": 181,
    "genre": "Superhéroes",
    "rating": "PG-13"
  }'
```

### Crear una función
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

### Comprar un ticket
```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "showtimeId": 1,
    "customerName": "Juan Pérez",
    "customerEmail": "juan@email.com",
    "seatNumber": "A1"
  }'
```

## 🚀 Despliegue

### Variables de Entorno para Producción
```env
NODE_ENV=production
PORT=3000
DB_HOST=your-postgres-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=movies_db
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

**Desarrollado por Armando Jose** 🎬