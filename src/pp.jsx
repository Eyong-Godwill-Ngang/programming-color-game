import React, { useState, useEffect } from 'react';
import successSound from '../sounds/success.mp3';
import failureSound from '../sounds/failure.mp3';

const programmingLanguages = [
  { name: 'JavaScript', color: 'yellow' },
  { name: 'Python', color: 'blue' },
  { name: 'Ruby', color: 'red' },
  { name: 'Java', color: 'orange' },
  { name: 'C++', color: 'purple' },
];

const Game = () => {
  const [visible, setVisible] = useState(true);
  const [guesses, setGuesses] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [usedLanguages, setUsedLanguages] = useState([]);
  const [languageInput, setLanguageInput] = useState('');
  const [colorInput, setColorInput] = useState('');

  const successAudio = new Audio(successSound);
  const failureAudio = new Audio(failureSound);

  useEffect(() => {
    // Show colors for 4 seconds and then hide
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleGuess = () => {
    if (totalAttempts >= 20 || failedAttempts >= 5) return;

    const language = programmingLanguages.find(
      (lang) => lang.name.toLowerCase() === languageInput.toLowerCase()
    );

    if (!language || usedLanguages.includes(language.name.toLowerCase())) {
      setFailedAttempts((prev) => prev + 1);
      setGuesses((prev) => [
        ...prev,
        {
          attempt: totalAttempts + 1,
          language: languageInput || 'Invalid',
          color: colorInput,
          status: 'failed',
        },
      ]);
      failureAudio.play();
    } else if (language.color.toLowerCase() === colorInput.toLowerCase()) {
      setGuesses((prev) => [
        ...prev,
        {
          attempt: totalAttempts + 1,
          language: language.name,
          color: language.color,
          status: 'success',
        },
      ]);
      setUsedLanguages((prev) => [...prev, language.name.toLowerCase()]);
      successAudio.play();
    } else {
      setFailedAttempts((prev) => prev + 1);
      setGuesses((prev) => [
        ...prev,
        {
          attempt: totalAttempts + 1,
          language: language.name,
          color: colorInput,
          status: 'failed',
        },
      ]);
      failureAudio.play();
    }

    setTotalAttempts((prev) => prev + 1);
    setLanguageInput('');
    setColorInput('');
  };

  const isGameOver = failedAttempts >= 5 || totalAttempts >= 20;

  return (
    <div className="game-container">
      {visible && (
        <div className="language-list">
          {programmingLanguages.map((lang, index) => (
            <div
              key={index}
              style={{
                backgroundColor: lang.color,
                padding: '10px',
                margin: '5px',
                color: 'white',
              }}
            >
              {lang.name}
            </div>
          ))}
        </div>
      )}

      {!visible && !isGameOver && (
        <div className="input-section">
          <input
            type="text"
            placeholder="Programming Language"
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
          />
          <input
            type="text"
            placeholder="Color"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
          />
          <button onClick={handleGuess}>Submit</button>
        </div>
      )}

      {isGameOver && (
        <div className="game-over">
          <h2>Game Over</h2>
          <p>{failedAttempts >= 5 ? 'Too many failed attempts!' : 'Max guesses reached!'}</p>
        </div>
      )}

      <div className="results-table">
        <table>
          <thead>
            <tr>
              <th>Attempt</th>
              <th>Programming Language</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {guesses.map((guess, index) => (
              <tr key={index}>
                <td>{guess.attempt}</td>
                <td style={{ backgroundColor: guess.color }}>{guess.language}</td>
                <td
                  style={{
                    backgroundColor: guess.status === 'success' ? 'green' : 'red',
                    color: 'white',
                  }}
                >
                  {guess.status === 'success' ? '✔' : '✘'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Game;