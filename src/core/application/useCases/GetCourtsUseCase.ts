import { Court } from '../../domain/entities/Reservation';
import { CourtRepository } from '../../domain/repositories/CourtRepository';

export class GetCourtsUseCase {
  constructor(private courtRepository: CourtRepository) {}

  async execute(): Promise<Court[]> {
    return await this.courtRepository.getCourts();
  }
} 