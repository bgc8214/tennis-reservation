import { Court } from '../../core/domain/entities/Reservation';
import { CourtRepository } from '../../core/domain/repositories/CourtRepository';
import { addDays, format, addMonths, setDate, setHours, setMinutes } from 'date-fns';

const today = new Date();
// 매헌시민의숲 다음 예약 오픈일 계산 (다음 달 1일 9시)
const nextReservationOpenMaeheon = setMinutes(
  setHours(
    setDate(
      addMonths(today, 1),
      1
    ),
    9
  ),
  0
);

// 내곡테니스장 다음 예약 오픈일 계산 (다음 달 10일 9시)
const nextReservationOpenNaegok = setMinutes(
  setHours(
    setDate(
      addMonths(today, 1),
      10
    ),
    9
  ),
  0
);

const MOCK_COURTS: Court[] = [
  {
    id: '1',
    name: '매헌시민의숲 테니스장',
    location: '서울시 서초구 매헌로 99',
    availableDates: [
      format(nextReservationOpenMaeheon, 'yyyy-MM-dd'),
    ],
    description: '매월 1일 09:00 예약 오픈',
    bookingUrl: 'https://m.booking.naver.com/booking/10/bizes/210031/'
  },
  {
    id: '2',
    name: '내곡테니스장',
    location: '서울시 서초구 내곡동 1-1290',
    availableDates: [
      format(nextReservationOpenNaegok, 'yyyy-MM-dd'),
    ],
    description: '매월 10일 09:00 예약 오픈',
    bookingUrl: 'https://m.booking.naver.com/booking/10/bizes/217811/'
  }
];

export class LocalCourtRepository implements CourtRepository {
  async getCourts(): Promise<Court[]> {
    return MOCK_COURTS.sort((a, b) => {
      const aEarliestDate = new Date(Math.min(...a.availableDates.map(d => new Date(d).getTime())));
      const bEarliestDate = new Date(Math.min(...b.availableDates.map(d => new Date(d).getTime())));
      return aEarliestDate.getTime() - bEarliestDate.getTime();
    });
  }

  async getCourtById(id: string): Promise<Court | null> {
    const court = MOCK_COURTS.find(court => court.id === id);
    return court || null;
  }
} 