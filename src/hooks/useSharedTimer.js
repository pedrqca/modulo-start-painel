import { useState, useEffect } from 'react';

export const useSharedTimer = () => {
  const [timerState, setTimerState] = useState({
    time: 0,
    isRunning: false,
    teamName: '',
    missionName: '',
    status: 'Aguardando início...'
  });

  const updateStateFromStorage = () => {
    const savedTime = localStorage.getItem('timer_time') || 0;
    const isRunning = localStorage.getItem('timer_running') === 'true';
    const teamName = localStorage.getItem('timer_team') || '';
    const missionName = localStorage.getItem('timer_mission') || '';
    
    let status = 'AGUARDANDO';
    if (isRunning) status = 'EM EXECUÇÃO';
    else if (Number(savedTime) > 0) status = 'PAUSADO';

    setTimerState({
      time: Number(savedTime),
      isRunning,
      teamName,
      missionName,
      status
    });
  };

  useEffect(() => {
    
    updateStateFromStorage();

    
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('timer_')) {
        updateStateFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    
    const interval = setInterval(updateStateFromStorage, 200);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  
  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return { ...timerState, formattedTime: formatTime(timerState.time) };
};