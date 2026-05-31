import { useEffect, useState } from "react";

const subjects = [
  "Work",
  "Reading",
  "Exercise",
  "Study",
];
const FOCUS_TIME = 5;
const BREAK_TIME = 5;

function App() {
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const [selectedSubject, setSelectedSubject] = useState("Work");

  function saveSession(subject) {
  const existingSessions =
    JSON.parse(localStorage.getItem("sessions")) || [];

  const newSession = {
    subject,
    duration: 25,
    date: new Date().toISOString(),
  };

  existingSessions.push(newSession);

  localStorage.setItem(
    "sessions",
    JSON.stringify(existingSessions)
  );
}

  function handleStart() {
    setIsRunning(true);
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleReset() {
    setIsRunning(false);
    setMode("focus");
    setSecondsLeft(FOCUS_TIME);
  }

  useEffect(() => {
    if (!isRunning) return;

    const timerId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);

         if (mode === "focus") {
  saveSession(selectedSubject);

  alert("집중 세션 완료! 🎉");

  setMode("break");

  return BREAK_TIME;
} else {
            alert("휴식 완료! 다시 집중할 시간 🍅");
            setMode("focus");
            setIsRunning(false);
            return FOCUS_TIME;
          }
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, mode]);

  <select
  value={selectedSubject}
  onChange={(e) => setSelectedSubject(e.target.value)}
>
  {subjects.map((subject) => (
    <option key={subject} value={subject}>
      {subject}
    </option>
  ))}
</select>
  return (
    <div>
      <h1>🍅 Focus Timer</h1>

      <h2>{mode === "focus" ? "Focus" : "Break"}</h2>
    <h3>{selectedSubject}</h3>
      <h2>
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </h2>

      <button onClick={handleStart}>Start</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default App;