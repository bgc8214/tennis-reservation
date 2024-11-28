import React, { useEffect, useState } from 'react';
import { Court } from '../../../core/domain/entities/Reservation';
import { GetCourtsUseCase } from '../../../core/application/useCases/GetCourtsUseCase';
import { format, differenceInDays, differenceInSeconds } from 'date-fns';
import { ko } from 'date-fns/locale';

interface CourtListProps {
  getCourtsUseCase: GetCourtsUseCase;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CourtList: React.FC<CourtListProps> = ({ getCourtsUseCase }) => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: TimeLeft }>({});

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const courtsData = await getCourtsUseCase.execute();
        setCourts(courtsData);
      } catch (error) {
        console.error('코트 정보를 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, [getCourtsUseCase]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const newTimeLeft: { [key: string]: TimeLeft } = {};
      
      courts.forEach(court => {
        const targetDate = new Date(court.availableDates[0]);
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();
        
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
          
          newTimeLeft[court.id] = {
            days,
            hours,
            minutes,
            seconds
          };
        } else {
          newTimeLeft[court.id] = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          };
        }
      });
      
      setTimeLeft(newTimeLeft);
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [courts]);

  const calculateDDay = (date: string) => {
    const today = new Date();
    const targetDate = new Date(date);
    const diff = differenceInDays(targetDate, today);
    return diff;
  };

  const getEarliestDDay = (dates: string[]) => {
    return Math.min(...dates.map(date => calculateDDay(date)));
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-lg font-semibold text-gray-600">로딩중...</div>
    </div>;
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-md mx-auto space-y-4">
        {courts.map(court => {
          const earliestDDay = getEarliestDDay(court.availableDates);
          const dDayText = earliestDDay === 0 ? 'D-Day' : earliestDDay > 0 ? `D+${earliestDDay}` : `D${earliestDDay}`;
          const time = timeLeft[court.id];
          
          return (
            <div 
              key={court.id} 
              className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold mb-1">{court.name}</h3>
                  <p className="text-sm text-gray-600">{court.location}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-bold text-white mb-2
                      ${earliestDDay === 0 ? 'bg-red-500' : 
                        earliestDDay < 0 ? 'bg-blue-500' : 
                        'bg-gray-500'}`}
                  >
                    {dDayText}
                  </span>
                  {time && (
                    <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                      <span className="font-mono">{String(time.days).padStart(2, '0')}</span>일{' '}
                      <span className="font-mono">{String(time.hours).padStart(2, '0')}</span>시{' '}
                      <span className="font-mono">{String(time.minutes).padStart(2, '0')}</span>분{' '}
                      <span className="font-mono">{String(time.seconds).padStart(2, '0')}</span>초{' '}
                      <span className="text-blue-600 font-bold">후 OPEN</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-700 flex items-center">
                  <span>
                    {format(new Date(court.availableDates[0]), 'M월 d일 (EEE) HH:mm', { locale: ko })}
                  </span>
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                    예약일
                  </span>
                </p>
                {court.description && (
                  <p className="text-sm text-gray-500 mt-1">{court.description}</p>
                )}
                {court.bookingUrl && (
                  <div className="mt-4">
                    <a
                      href={court.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      네이버 예약하기
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 