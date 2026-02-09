
import { useState } from 'react';

interface ContentCalendarProps {
  darkMode: boolean;
}

const ContentCalendar = ({ darkMode }: ContentCalendarProps) => {
  const [currentMonth] = useState(new Date(2025, 0));

  const scheduledItems = [
    { date: 3, title: 'HSE Monthly Report', type: 'report', color: 'bg-red-600' },
    { date: 7, title: 'New Job Posting', type: 'job', color: 'bg-gray-700' },
    { date: 10, title: 'Gallery Update', type: 'media', color: 'bg-gray-500' },
    { date: 14, title: 'Tender Publication', type: 'tender', color: 'bg-red-600' },
    { date: 18, title: 'CSR Event Coverage', type: 'event', color: 'bg-gray-700' },
    { date: 22, title: 'Financial Report Q4', type: 'report', color: 'bg-red-600' },
    { date: 25, title: 'Notice: AGM', type: 'notice', color: 'bg-gray-500' },
    { date: 28, title: 'Blog: Mining Update', type: 'content', color: 'bg-gray-700' },
  ];

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === currentMonth.getMonth() &&
    today.getFullYear() === currentMonth.getFullYear();

  const getEventsForDate = (date: number) =>
    scheduledItems.filter((item) => item.date === date);

  const upcomingItems = scheduledItems
    .filter(
      (item) => !isCurrentMonth || item.date >= today.getDate()
    )
    .slice(0, 5);

  return (
    <div
      className={`rounded-lg p-6 border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <h2
          className={`text-lg font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
          style={{ fontFamily: 'Merriweather, serif' }}
        >
          Content Calendar
        </h2>
        <span
          className={`text-sm font-medium ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {currentMonth.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Mini Calendar */}
      <div className="mb-5">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map((day) => (
            <div
              key={day}
              className={`text-center text-xs font-medium py-1 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const date = i + 1;
            const events = getEventsForDate(date);
            const isToday = isCurrentMonth && date === today.getDate();

            return (
              <div
                key={date}
                className={`h-8 flex flex-col items-center justify-center rounded-md text-xs relative cursor-pointer transition-all ${
                  isToday
                    ? 'bg-red-600 text-white font-bold'
                    : events.length > 0
                    ? darkMode
                      ? 'bg-gray-700 text-white font-medium'
                      : 'bg-gray-100 text-gray-900 font-medium'
                    : darkMode
                    ? 'text-gray-400 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title={events.map((e) => e.title).join(', ')}
              >
                {date}
                {events.length > 0 && !isToday && (
                  <div className="absolute bottom-0.5 flex gap-0.5">
                    {events.slice(0, 2).map((e, idx) => (
                      <span
                        key={idx}
                        className={`w-1 h-1 rounded-full ${e.color}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Scheduled */}
      <div>
        <h3
          className={`text-sm font-semibold mb-3 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Upcoming Scheduled
        </h3>
        <div className="space-y-2.5">
          {upcomingItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              } cursor-pointer transition-all ${
                darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  darkMode ? 'bg-gray-600' : 'bg-white'
                }`}
              >
                <span
                  className={`text-sm font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {item.date}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {item.title}
                </p>
                <p
                  className={`text-xs capitalize ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {item.type}
                </p>
              </div>
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentCalendar;
