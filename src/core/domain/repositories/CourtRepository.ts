import { Court } from '../entities/Reservation';

export interface CourtRepository {
  getCourts(): Promise<Court[]>;
  getCourtById(id: string): Promise<Court | null>;
} 