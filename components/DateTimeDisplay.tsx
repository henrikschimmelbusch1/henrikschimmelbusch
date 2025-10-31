
import React, { useState, useEffect } from 'react';

const DateTimeDisplay: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleTimeString('en-US', options);
  };

  return (
    <div className="absolute top-6 text-center">
      <p className="text-lg font-bold font-sans text-gray-700" style={{ fontSize: '17px' }}>
        {formatDate(currentDateTime)} | {formatTime(currentDateTime)}
      </p>
    </div>
  );
};

export default DateTimeDisplay;
