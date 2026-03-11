import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
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

  const toggleSolved = useCallback(async (url) => {
    if (!user) return;
    
    // Use functional update to get freshest state in Case of rapid clicks, 
    // but for the side effects we need the values now.
    // Actually, reading from current scope is fine since handled in useCallback [user]
    // But to be safest with rapid clicks, we should use functional update for state
    // and just calculate the side-effect values.
    
    setSolved(prevSolved => {
      setUserProgress(prevProgress => {
        const isCurrentlySolved = prevSolved.includes(url);
        const newSolved = isCurrentlySolved
          ? prevSolved.filter(u => u !== url)
          : [...prevSolved, url];

        const newProgress = { ...prevProgress };
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

        // Apply side effects
        localStorage.setItem(`solved_${user.uid}`, JSON.stringify(newSolved));
        localStorage.setItem(`progress_${user.uid}`, JSON.stringify(newProgress));
        
        // Async API call (token fetch is also async)
        (async () => {
           try {
             const token = await user.getIdToken();
             await axios.post('/api/progress', { solved: newSolved, userProgress: newProgress }, {
               headers: { Authorization: `Bearer ${token}` }
             });
           } catch (err) {
             console.error("Failed to save progress", err);
           }
        })();

        return newProgress;
      });
      
      const isCurrentlySolved = prevSolved.includes(url);
      return isCurrentlySolved ? prevSolved.filter(u => u !== url) : [...prevSolved, url];
    });
  }, [user]);

  const updateQuestionData = useCallback(async (url, data) => {
    if (!user) return;

    setUserProgress(prevProgress => {
      setSolved(prevSolved => {
        const newProgress = {
          ...prevProgress,
          [url]: { ...(prevProgress[url] || {}), ...data }
        };

        let newSolved = [...prevSolved];
        if (data.status === 'Completed' && !prevSolved.includes(url)) {
          newSolved.push(url);
        } else if (data.status && data.status !== 'Completed' && prevSolved.includes(url)) {
          newSolved = prevSolved.filter(u => u !== url);
        }

        localStorage.setItem(`solved_${user.uid}`, JSON.stringify(newSolved));
        localStorage.setItem(`progress_${user.uid}`, JSON.stringify(newProgress));

        (async () => {
          try {
            const token = await user.getIdToken();
            await axios.post('/api/progress', { solved: newSolved, userProgress: newProgress }, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (err) {
            console.error("Failed to save progress data", err);
          }
        })();

        return newSolved;
      });
      return {
        ...prevProgress,
        [url]: { ...(prevProgress[url] || {}), ...data }
      };
    });
  }, [user]);

  const value = useMemo(() => ({
    solved, 
    userProgress, 
    toggleSolved, 
    updateQuestionData, 
    loading
  }), [solved, userProgress, toggleSolved, updateQuestionData, loading]);

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};