export const ERROR_MESSAGES = {
  MOVIE_NOT_FOUND: 'Movie with ID {id} not found',
  CINEMA_NOT_FOUND: 'Cinema with ID {id} not found',
  SHOWTIME_NOT_FOUND: 'Showtime with ID {id} not found',
  TICKET_NOT_FOUND: 'Ticket with ID {id} not found',
  PAST_DATE_SHOWTIME: 'Cannot create showtimes in the past',
  NO_SEATS_AVAILABLE: 'No seats available for this showtime',
  SEAT_OCCUPIED: 'Seat {seat} is already occupied',
  PAST_DATE_UPDATE: 'Cannot schedule showtimes in the past',
};

export const SUCCESS_MESSAGES = {
  MOVIE_CREATED: 'Movie created successfully',
  MOVIE_UPDATED: 'Movie updated successfully',
  MOVIE_DELETED: 'Movie deleted successfully',
  CINEMA_CREATED: 'Cinema created successfully',
  CINEMA_UPDATED: 'Cinema updated successfully',
  CINEMA_DELETED: 'Cinema deleted successfully',
  SHOWTIME_CREATED: 'Showtime created successfully',
  SHOWTIME_UPDATED: 'Showtime updated successfully',
  SHOWTIME_DELETED: 'Showtime deleted successfully',
  TICKET_CREATED: 'Ticket purchased successfully',
  TICKET_CANCELLED: 'Ticket cancelled successfully',
};

export const API_SUMMARIES = {
  // Movies
  CREATE_MOVIE: 'Create a new movie',
  GET_ALL_MOVIES: 'Get all movies',
  GET_MOVIE_BY_ID: 'Get a movie by ID',
  UPDATE_MOVIE: 'Update a movie',
  DELETE_MOVIE: 'Delete a movie',
  
  // Cinemas
  CREATE_CINEMA: 'Create a new cinema',
  GET_ALL_CINEMAS: 'Get all cinemas',
  GET_CINEMA_BY_ID: 'Get a cinema by ID',
  UPDATE_CINEMA: 'Update a cinema',
  DELETE_CINEMA: 'Delete a cinema',
  
  // Showtimes
  CREATE_SHOWTIME: 'Create a new showtime',
  GET_ALL_SHOWTIMES: 'Get all showtimes',
  GET_SHOWTIME_BY_ID: 'Get a showtime by ID',
  GET_AVAILABLE_SEATS: 'Get available seats for a showtime',
  UPDATE_SHOWTIME: 'Update a showtime',
  DELETE_SHOWTIME: 'Delete a showtime',
  
  // Tickets
  PURCHASE_TICKET: 'Purchase a ticket',
  GET_ALL_TICKETS: 'Get all tickets',
  GET_TICKET_BY_ID: 'Get a ticket by ID',
  GET_TICKETS_BY_SHOWTIME: 'Get tickets by showtime',
  CANCEL_TICKET: 'Cancel a ticket',
};

export const API_DESCRIPTIONS = {
  MOVIES_LIST: 'List of movies',
  MOVIE_FOUND: 'Movie found',
  CINEMAS_LIST: 'List of cinemas',
  CINEMA_FOUND: 'Cinema found',
  SHOWTIMES_LIST: 'List of showtimes',
  SHOWTIME_FOUND: 'Showtime found',
  AVAILABLE_SEATS_COUNT: 'Number of available seats',
  TICKETS_LIST: 'List of tickets',
  TICKET_FOUND: 'Ticket found',
  SHOWTIME_TICKETS_LIST: 'List of tickets for the showtime',
};