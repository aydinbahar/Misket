import React, { useState, useEffect } from 'react';
import { getRandomMessage, getCurrentDay } from '../utils/motivationalMessages';
import { Calendar, Clock } from 'lucide-react';

const HomeView = ({ setCurrentView, setSelectedUnit, setTestMode }) => {
  const [motivationalMessage, setMotivationalMessage] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Her component mount olduğunda yeni bir mesaj seç
  useEffect(() => {
    setMotivationalMessage(getRandomMessage());
  }, []);

  // Doğum günü countdown hesaplama
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      // Bu yılki doğum günü (20 Nisan 14:25)
      let birthday = new Date(currentYear, 3, 20, 14, 25, 0); // Ay 0-indexed, Nisan = 3
      
      // Eğer bu yılki doğum günü geçtiyse, gelecek yılki doğum gününü al
      if (now > birthday) {
        birthday = new Date(currentYear + 1, 3, 20, 14, 25, 0);
      }
      
      const difference = birthday - now;
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // İlk hesaplama
    calculateTimeLeft();
    
    // Her saniye güncelle
    const interval = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const dayInfo = getCurrentDay();

  return (
    <div className="space-y-6">
      {/* Motivasyon Mesajı - Hoş Geldin */}
      {motivationalMessage && (
        <div className="card bg-gradient-to-br from-purple-950/60 via-pink-950/50 to-purple-950/60 border-2 border-purple-600/40 shadow-2xl shadow-purple-900/20 p-6 md:p-8">
          <div className="flex items-start gap-5 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-3xl md:text-4xl shadow-lg shadow-purple-500/30">
              💜
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <h3 className="font-bold text-purple-200 text-xl md:text-2xl">
                  Merhaba Serra! 
                </h3>
                <span className="text-sm md:text-base text-purple-300/80 bg-purple-900/40 px-2 py-1 rounded-lg">
                  {dayInfo.tr}
                </span>
                <span className="text-2xl md:text-3xl ml-auto">🐾</span>
              </div>
              <p className="text-lg md:text-xl text-purple-100 mb-4 font-semibold leading-relaxed">
                {motivationalMessage.tr} 🐾
              </p>
              <div className="pt-3 border-t border-purple-700/30">
                <p className="text-base md:text-lg text-purple-200/90 italic leading-relaxed">
                  {motivationalMessage.en} 🐾
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doğum Günü Countdown */}
      <div className="card bg-gradient-to-br from-pink-950/60 via-purple-950/50 to-pink-950/60 border-2 border-pink-600/40 shadow-2xl shadow-pink-900/20 p-6 md:p-8">
        <div className="flex items-start gap-4 md:gap-5">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 text-2xl md:text-3xl shadow-lg shadow-pink-500/30">
            🎂
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-pink-400" />
              <h3 className="font-bold text-pink-200 text-lg md:text-xl">
                Serra'nın Doğum Gününe Kalan Süre
              </h3>
            </div>
            <div className="flex items-center gap-4 md:gap-6 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-pink-300" />
                <span className="text-sm text-pink-300/80">20 Nisan, 14:25</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 md:gap-3 mt-4">
              <div className="bg-pink-900/30 rounded-lg p-3 md:p-4 border border-pink-700/50 text-center">
                <div className="text-2xl md:text-3xl font-bold text-pink-200 mb-1">
                  {timeLeft.days}
                </div>
                <div className="text-xs md:text-sm text-pink-300/80">Gün</div>
              </div>
              <div className="bg-pink-900/30 rounded-lg p-3 md:p-4 border border-pink-700/50 text-center">
                <div className="text-2xl md:text-3xl font-bold text-pink-200 mb-1">
                  {timeLeft.hours}
                </div>
                <div className="text-xs md:text-sm text-pink-300/80">Saat</div>
              </div>
              <div className="bg-pink-900/30 rounded-lg p-3 md:p-4 border border-pink-700/50 text-center">
                <div className="text-2xl md:text-3xl font-bold text-pink-200 mb-1">
                  {timeLeft.minutes}
                </div>
                <div className="text-xs md:text-sm text-pink-300/80">Dakika</div>
              </div>
              <div className="bg-pink-900/30 rounded-lg p-3 md:p-4 border border-pink-700/50 text-center">
                <div className="text-2xl md:text-3xl font-bold text-pink-200 mb-1">
                  {timeLeft.seconds}
                </div>
                <div className="text-xs md:text-sm text-pink-300/80">Saniye</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;

