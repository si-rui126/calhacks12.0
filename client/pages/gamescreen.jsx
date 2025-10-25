import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TriangleIcon, DiamondIcon, CircleIcon, SquareIcon } from '../component/icons';

const QUESTION_TIME = 20;

const answerStyles = [
  { color: 'bg-red-600', hover: 'hover:bg-red-700', icon: <TriangleIcon /> },
  { color: 'bg-blue-600', hover: 'hover:bg-blue-700', icon: <DiamondIcon /> },
  { color: 'bg-yellow-500', hover: 'hover:bg-yellow-600', icon: <CircleIcon /> },
  { color: 'bg-green-600', hover: 'hover:bg-green-700', icon: <SquareIcon /> },
];

const GameScreen = ({ questions, onGameEnd }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, [currentQuestionIndex, startTimer, clearTimer]);

  const handleNextQuestion = useCallback(() => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(QUESTION_TIME);
    } else {
      onGameEnd(score);
    }
  }, [currentQuestionIndex, questions.length, onGameEnd, score]);

  useEffect(() => {
    if (timeLeft <= 0 && !showFeedback) {
      clearTimer();
      setIsCorrect(false);
      setShowFeedback(true);
    }
  }, [timeLeft, clearTimer, showFeedback]);

  const handleAnswerClick = (option) => {
    if (showFeedback) return;
    
    clearTimer();
    setSelectedAnswer(option);
    
    const currentQuestion = questions[currentQuestionIndex];
    const correct = option === currentQuestion.answer;
    
    if (correct) {
      const points = 500 + Math.floor(500 * (timeLeft / QUESTION_TIME));
      setScore(prev => prev + points);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    setShowFeedback(true);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="relative w-full h-screen flex flex-col p-4 bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-bold">
          {currentQuestionIndex + 1} / {questions.length}
        </div>
        <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          QuizWhiz AI
        </div>
        <div className="text-2xl font-bold">Score: {score}</div>
      </div>

      {/* Question */}
      <div className="flex-grow flex items-center justify-center text-center bg-gray-800 rounded-lg p-6 mb-4">
        <h2 className="text-3xl md:text-4xl font-bold">{currentQuestion.question}</h2>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => {
          const style = answerStyles[index % 4];
          let buttonClass = `${style.color} ${style.hover}`;

          if (showFeedback) {
            if (option === currentQuestion.answer) {
              buttonClass = 'bg-green-500 scale-105'; // Correct answer
            } else if (option === selectedAnswer) {
              buttonClass = 'bg-red-700 opacity-70'; // Incorrect selected answer
            } else {
              buttonClass = `${style.color} opacity-50`; // Other options
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerClick(option)}
              disabled={showFeedback}
              className={`flex items-center justify-start p-4 rounded-lg shadow-lg transform transition-all duration-300 ${buttonClass}`}
            >
              <div className="w-12 h-12 flex-shrink-0 bg-white bg-opacity-20 rounded-md flex items-center justify-center mr-4">
                {style.icon}
              </div>
              <span className="text-lg md:text-xl font-semibold text-left">{option}</span>
            </button>
          );
        })}
      </div>
      
      {/* Timer and Feedback */}
      <div className="h-24 mt-4">
         {!showFeedback && (
          <div className="w-full flex flex-col items-center">
            <div className="text-5xl font-bold mb-2">{timeLeft}</div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full" style={{ width: `${(timeLeft / QUESTION_TIME) * 100}%`, transition: 'width 1s linear' }}></div>
            </div>
          </div>
        )}
        {showFeedback && (
          <div className="flex flex-col items-center justify-center h-full bg-gray-800 rounded-lg animate-fade-in">
            <div className={`text-4xl font-extrabold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? 'Correct!' : timeLeft <= 0 ? "Time's Up!" : 'Incorrect!'}
            </div>
            <button onClick={handleNextQuestion} className="mt-4 px-8 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-colors duration-300">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;