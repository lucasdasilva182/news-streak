import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface CalendarMarkedDaysProps {
  markedDates: string[];
}

const Calendar = ({ markedDates }: CalendarMarkedDaysProps) => {
  const markedCalendarDates = markedDates;

  const [currentDate, setCurrentDate] = useState(new Date());

  const changeMonth = (increment: number) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();

    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const calendarDays = [];
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(
        2,
        '0'
      )}`;
      calendarDays.push({
        day,
        isMarked: markedCalendarDates.includes(formattedDate),
      });
    }

    return calendarDays;
  };

  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="w-full max-w-md rounded border border-muted bg-card text-card-foreground shadow-sm  p-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="text-gray-500 hover:text-gray-700">
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={() => changeMonth(1)} className="text-gray-500 hover:text-gray-700">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-extrabold text-primary mb-2">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {renderCalendar().map((day, index) => {
          if (!day) {
            return <div key={index}></div>;
          }

          const isSunday =
            new Date(currentDate.getFullYear(), currentDate.getMonth(), day.day).getDay() === 0;

          const isToday =
            new Date(currentDate.getFullYear(), currentDate.getMonth(), day.day).toDateString() ===
            new Date().toDateString();

          return (
            <div
              key={index}
              className={`text-center py-3 relative rounded 
              ${day.isMarked ? 'font-extrabold ' : ''} 
              ${isSunday ? 'text-red-500' : ''}
              ${isToday ? 'bg-primary' : ''}
              `}
            >
              {day.day}
              {day.isMarked ? (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                  <img src="/full_streak.png" alt="Icone The News" className={`"w-6 h-6 "`} />
                </div>
              ) : (
                ''
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
