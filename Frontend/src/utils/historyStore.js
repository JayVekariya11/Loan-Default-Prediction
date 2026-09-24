// Prediction history stored in localStorage
const STORAGE_KEY = 'loanDefaultHistory';

export const saveToHistory = (formData, result) => {
  const history = getHistory();
  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    inputs: formData,
    result,
  };
  history.unshift(entry); // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50))); // keep last 50
  return entry;
};

export const getHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};
