import React, { useState, useEffect } from 'react';
import { CourtList } from './presentation/components/CourtList/CourtList';
import { GetCourtsUseCase } from './core/application/useCases/GetCourtsUseCase';
import { LocalCourtRepository } from './infrastructure/repositories/LocalCourtRepository';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const courtRepository = new LocalCourtRepository();
  const getCourtsUseCase = new GetCourtsUseCase(courtRepository);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm mb-6">
        <div className="max-w-4xl mx-auto py-4 px-4">
          <h1 className="text-xl font-bold text-center mb-2">
            테니스 디데이 예약
          </h1>
          <div className="text-center text-gray-600 text-sm">
            <time dateTime={currentTime.toISOString()}>
              {format(currentTime, 'yyyy년 M월 d일 (EEE) HH:mm:ss', { locale: ko })}
            </time>
          </div>
        </div>
      </header>
      <main>
        <CourtList getCourtsUseCase={getCourtsUseCase} />
      </main>
    </div>
  );
}

export default App; 