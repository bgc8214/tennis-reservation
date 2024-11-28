import { Court, Reservation } from '../../core/domain/entities/Reservation';

export class LocalReservationRepository {
  private courts: Court[] = [];
  private reservations: Reservation[] = [];

  async getCourts(): Promise<Court[]> {
    return this.courts;
  }

  async getReservations(courtId: string): Promise<Reservation[]> {
    return this.reservations.filter(r => r.courtId === courtId);
  }

  async addReservation(reservation: Reservation): Promise<void> {
    this.reservations.push(reservation);
  }

  async getDDay(date: string): Promise<number> {
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate.getTime() - today.getTime();
    return Promise.resolve(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }
}

export default LocalReservationRepository; 