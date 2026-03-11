import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const ProgressContext = createContext();
export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const { user } = useAuth();
  const [solved, setSolved] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSolved([]);
      setUserProgress({});
      setLoading(false);
      return;
    }

    // Attempt local load immediately
    const localSolved = localStorage.getItem(`solved_${user.uid}`);
    const localProgress = localStorage.getItem(`progress_${user.uid}`);
    if (localSolved) setSolved(JSON.parse(localSolved));
    if (localProgress) setUserProgress(JSON.parse(localProgress));

    const fetchProgress = async () => {
      try {
        const token = await user.getIdToken();
        const { data } = await axios.get('/api/progress', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Merge fetched data over local data or fallback to local
        let serverSolved = data.solved;
        let serverProgress = data.userProgress;

        if ((!serverSolved || serverSolved.length === 0) && localSolved) {
          serverSolved = JSON.parse(localSolved);
        }
        if ((!serverProgress || Object.keys(serverProgress).length === 0) && localProgress) {
          serverProgress = JSON.parse(localProgress);
        }

        serverSolved = serverSolved || [];
        serverProgress = serverProgress || {};

        setSolved(serverSolved);
        setUserProgress(serverProgress);

        // Update local with absolute truth
        localStorage.setItem(`solved_${user.uid}`, JSON.stringify(serverSolved));
        localStorage.setItem(`progress_${user.uid}`, JSON.stringify(serverProgress));
      } catch (err) {
        console.error("Failed to fetch progress from backend, using local state", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [user]);

  const toggleSolved = async (url) => {
    if (!user) return;
    const isCurrentlySolved = solved.includes(url);
    const newSolved = isCurrentlySolved
      ? solved.filter(u => u !== url)
      : [...solved, url];
    setSolved(newSolved);

    // Also update the status in userProgress
    const newProgress = { ...userProgress };
    if (!isCurrentlySolved) {
      newProgress[url] = { ...(newProgress[url] || {}), status: 'Completed' };
    } else {
      if (newProgress[url]) {
        delete newProgress[url].status;
        if (Object.keys(newProgress[url]).length === 0) {
          delete newProgress[url];
        }
      }
    }
    setUserProgress(newProgress);
    localStorage.setItem(`solved_${user.uid}`, JSON.stringify(newSolved));
    localStorage.setItem(`progress_${user.uid}`, JSON.stringify(newProgress));

    try {
      const token = await user.getIdToken();
      await axios.post('/api/progress', { solved: newSolved, userProgress: newProgress }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  };

  const updateQuestionData = async (url, data) => {
    if (!user) return;

    const newProgress = {
      ...userProgress,
      [url]: { ...(userProgress[url] || {}), ...data }
    };

    // Auto-sync solved array if status is 'Completed'
    let newSolved = [...solved];
    if (data.status === 'Completed' && !solved.includes(url)) {
      newSolved.push(url);
      setSolved(newSolved);
    } else if (data.status && data.status !== 'Completed' && solved.includes(url)) {
      newSolved = solved.filter(u => u !== url);
      setSolved(newSolved);
    }

    setUserProgress(newProgress);
    localStorage.setItem(`solved_${user.uid}`, JSON.stringify(newSolved));
    localStorage.setItem(`progress_${user.uid}`, JSON.stringify(newProgress));

    try {
      const token = await user.getIdToken();
      await axios.post('/api/progress', { solved: newSolved, userProgress: newProgress }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Failed to save progress data", err);
    }
  };

  return (
    <ProgressContext.Provider value={{ solved, userProgress, toggleSolved, updateQuestionData, loading }}>
      {children}
    </ProgressContext.Provider>
  );
};