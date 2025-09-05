import { dataSource } from '../../config/database.config';
import { Movie } from '../../entities/movie.entity';
import { Cinema } from '../../entities/cinema.entity';
import { Showtime } from '../../entities/showtime.entity';

async function seed() {
  await dataSource.initialize();

  const movieRepository = dataSource.getRepository(Movie);
  const cinemaRepository = dataSource.getRepository(Cinema);
  const showtimeRepository = dataSource.getRepository(Showtime);

  // Crear películas
  const movies = await movieRepository.save([
    {
      title: 'Avatar: El Camino del Agua',
      description: 'Secuela de la exitosa película Avatar',
      duration: 192,
      genre: 'Ciencia Ficción',
      rating: 'PG-13',
    },
    {
      title: 'Top Gun: Maverick',
      description: 'Pete "Maverick" Mitchell regresa después de más de 30 años',
      duration: 131,
      genre: 'Acción',
      rating: 'PG-13',
    },
    {
      title: 'Spider-Man: No Way Home',
      description: 'Peter Parker debe enfrentar villanos de otras dimensiones',
      duration: 148,
      genre: 'Superhéroes',
      rating: 'PG-13',
    },
  ]);

  // Crear salas de cine
  const cinemas = await cinemaRepository.save([
    {
      name: 'Sala IMAX',
      location: 'Centro Comercial Plaza Norte',
      capacity: 300,
    },
    {
      name: 'Sala Premium',
      location: 'Cinépolis Multiplaza',
      capacity: 150,
    },
    {
      name: 'Sala VIP',
      location: 'Cinemark Megaplaza',
      capacity: 80,
    },
  ]);

  // Crear funciones (fechas futuras)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(14, 0, 0, 0);

  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  dayAfterTomorrow.setHours(19, 30, 0, 0);

  await showtimeRepository.save([
    {
      movieId: movies[0].id,
      cinemaId: cinemas[0].id,
      startTime: tomorrow,
      price: 25.50,
    },
    {
      movieId: movies[1].id,
      cinemaId: cinemas[1].id,
      startTime: dayAfterTomorrow,
      price: 22.00,
    },
    {
      movieId: movies[2].id,
      cinemaId: cinemas[2].id,
      startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días
      price: 30.00,
    },
  ]);

  console.log('✅ Datos de prueba creados exitosamente');
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('❌ Error al crear datos de prueba:', error);
  process.exit(1);
});