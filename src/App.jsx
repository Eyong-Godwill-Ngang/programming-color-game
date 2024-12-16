import  { useState, useEffect } from 'react';
import successSound from '../sounds/success.mp3';
import failureSound from '../sounds/failure.mp3';

//Assigning each programming language to its color
const programmingLanguages = [
  { name: 'javascript', color: 'green' },
  { name: 'React', color: 'Red' },
  { name: 'React Native', color: 'Yellow' },
  { name: 'c++', color: 'black' },
  { name: 'c', color: 'orange' },
  { name: 'ruby', color: 'purple' },
];


const Game = () => {
  const [visible, setvisible] = useState('True');
  const [quesses, setquesses] = useState([]);
  const [failedAttempts, setfailedAttempts] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [languageInput, setLanguageInput] = useState('');
  const [usedlanguages, setUsedLanguages] = useState([]);
  const [colorInput, setcolorInput] = useState('');

  const successAudio = new Audio(successSound);
  const failedAudio = new Audio(failureSound);


  useEffect(() => {
    // show color for 4 seconds
    const timer = setTimeout(() => {
      setvisible(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, 
  []);

  const handleGuess = () => {
    if (totalAttempts >= 20
      || failedAttempts >= 5) return;
    const language = programmingLanguages.find(
      (lang) => lang.name.toLowerCase() == languageInput.toLowerCase()
    );
    if (!language || usedlanguages.includes(language.name.toLowerCase())) {
      setfailedAttempts((prev) => prev + 1);
      setquesses((prev) => [
        ...prev,

        {
          attempt: totalAttempts + 1,
          language: languageInput || 'invalid',
          color: colorInput,
          status: 'failed',
        },
      ]);
      failedAudio.play();
    }

    else if (language.color.toLowerCase()
      === colorInput.toLowerCase()) {
      setquesses((prev) => [
        ...prev,

        {
          attempt: totalAttempts + 1,
          language: language.name,
          color: language.color,
          status: 'success',
        },
      ]);
      setUsedLanguages((prev) => [
        ...prev,
        language.name.toLowerCase()]);
      successAudio.play();
    }
    else {
      setfailedAttempts((prev) => prev + 1);
      setquesses((prev) => [
        ...prev,
        {
          attempt: totalAttempts + 1,
          language: language.name,
          color: colorInput,
          status: 'Failed',
        },
      ]);
      setTotalAttempts((prev) => prev + 1);
      setLanguageInput('');
      setcolorInput('');
    };

    const isGameover = failedAttempts >= 5
      || totalAttempts >= 20;
    return (
      <div className='game-container'>
        {visible && (
          <div className="languages-list">
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


        {!visible && !isGameover && (
          <div className="input-section">
            <input
              type="text"
              placeholder="programming language"
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
            />
            <input
              type="text"
              placeholder="color"
              value={colorInput}
              onChange={(e) => setcolorInput(e.target.value)}
            />
            <button onClick={handleGuess}>submit</button>
          </div>
        
        )}

        {isGameover && (
          <div className="game-over">
            <h2>Game over</h2>
            <p>{failedAttempts >= 5 ?
              'Too many failed attempts!' : 'max quesses reached!'}</p>
          </div>
        )}
        <div className="results-table">
          <table>
            <thead>
              <tr>
                <th>Attempt</th>
                <th>programming language</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              {quesses.map((quess, index) => (
                <tr key={index}>
                  <td>{quess.attempt}</td>
                  <td style={
                    {
                      backgroundColor: quess.color
                    }}>{quess.language}
                  </td>
                  <td
                    style={{
                      backgroundColor: quess.status ===
                        'success' ? 'green' : 'red',
                      color: 'white',
                    }}>
                    {quess.status === 'success' ? '✔' : '✘'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

  };

};


export default Game;