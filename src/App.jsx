import { useEffect, useState } from "react";

const subjects = ["Work", "Reading", "Exercise", "Study"];

const FOCUS_TIME = 5;
const BREAK_TIME = 5;

function App() {
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Work");
  const [sessions, setSessions] = useState([]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const [subjectFilter, setSubjectFilter] = useState("All");

  const filteredSessions =
  subjectFilter === "All"
    ? sessions
    : sessions.filter((session) => session.subject === subjectFilter);

  useEffect(() => {
    const savedSessions =
      JSON.parse(localStorage.getItem("sessions")) || [];

    setSessions(savedSessions);
  }, []);

  function saveSession(subject) {
    const existingSessions =
      JSON.parse(localStorage.getItem("sessions")) || [];

    const newSession = {
      subject,
      duration: 25,
      date: new Date().toISOString(),
    };

    const updatedSessions = [...existingSessions, newSession];

    localStorage.setItem("sessions", JSON.stringify(updatedSessions));
    setSessions(updatedSessions);
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

  function handleDelete(indexToDelete) {
  const updatedSessions = sessions.filter(
    (_, index) => index !== indexToDelete
  );

  setSessions(updatedSessions);

  localStorage.setItem(
    "sessions",
    JSON.stringify(updatedSessions)
  );
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
          }

          alert("휴식 완료! 다시 집중할 시간 🍅");
          setMode("focus");
          setIsRunning(false);
          return FOCUS_TIME;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, mode, selectedSubject]);

  return (
  
  <div>
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

    <h1>🍅 Focus Timer</h1>
    <h2>{mode === "focus" ? "Focus" : "Break"}</h2>
    <h3>{selectedSubject}</h3>

    <h2>
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </h2>

    <button onClick={handleStart}>Start</button>
    <button onClick={handlePause}>Pause</button>
    <button onClick={handleReset}>Reset</button>

    <hr />

    <h2>History</h2>

    <select
      value={subjectFilter}
      onChange={(e) => setSubjectFilter(e.target.value)}
    >
      <option value="All">전체</option>

      {subjects.map((subject) => (
        <option key={subject} value={subject}>
          {subject}
        </option>
      ))}
    </select>

    <ul>
      {filteredSessions.map((session, index) => (
        <li key={index}>
          {session.subject} / {session.duration}분 /{" "}
          {new Date(session.date).toLocaleString()}

          <button onClick={() => handleDelete(index)}>
            삭제
          </button>
        </li>
      ))}
    </ul>
  </div>
);
}

export default App;