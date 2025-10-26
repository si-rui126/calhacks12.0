import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TriangleIcon, DiamondIcon, CircleIcon, SquareIcon } from '../component/icons';
import "./style.css";

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

  // Safety check: ensure questions exists
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl mb-4">No questions available</h2>
          <p className="text-gray-400">Please generate a quiz first.</p>
        </div>
      </div>
    );
  }

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

// Wrapper component for direct route usage
const GameScreenWrapper = () => {
  const navigate = useNavigate();
  const location = window.location; // Access location for state
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        // Get quiz ID from session storage
        const quizId = sessionStorage.getItem('quizId');
        const className = sessionStorage.getItem('selectedClass') || 'Unknown Class';
        const subject = sessionStorage.getItem('selectedSubject') || 'General';
        
        console.log('Class:', className, 'Subject:', subject, 'Quiz ID:', quizId);
        
        if (!quizId) {
          console.error('No quiz ID found in session storage');
          // Clear session storage and redirect to classroom
          sessionStorage.removeItem('selectedClass');
          sessionStorage.removeItem('selectedSubject');
          sessionStorage.removeItem('quizId');
          navigate('/classroom');
          return;
        }

        // Fetch quiz data from database
        const response = await fetch(`http://localhost:8080/api/quizzes/${quizId}`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.quiz_data) {
          // Transform quiz data to the format expected by GameScreen
          const transformedQuestions = Object.entries(data.data.quiz_data).map(([key, questionData]) => {
            const answers = Object.values(questionData.answers);
            const correctAnswer = answers.find(answer => answer.startsWith('correct~~'));
            const incorrectAnswers = answers.filter(answer => answer.startsWith('incorrect~~'));
            
            // Clean up answer text (remove prefixes)
            const cleanAnswers = answers.map(answer => answer.replace(/^(correct~~|incorrect~~|shortanswer~~)/, ''));
            
            return {
              question: questionData.question,
              options: cleanAnswers,
              answer: correctAnswer ? correctAnswer.replace('correct~~', '') : cleanAnswers[0]
            };
          });
          
          console.log('Transformed questions:', transformedQuestions);
          setQuestions(transformedQuestions);
        } else {
          console.error('Failed to fetch quiz data:', data);
          // Fallback to demo questions if fetch fails
          const demoQuestions = [
            {
              question: "What is the capital of France?",
              options: ["London", "Berlin", "Paris", "Madrid"],
              answer: "Paris"
            },
            {
              question: "Which planet is known as the Red Planet?",
              options: ["Venus", "Mars", "Jupiter", "Saturn"],
              answer: "Mars"
            },
            {
              question: "What is 2 + 2?",
              options: ["3", "4", "5", "6"],
              answer: "4"
            }
          ];
          setQuestions(demoQuestions);
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        // Fallback to demo questions on error
        const demoQuestions = [
          {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            answer: "Paris"
          },
          {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            answer: "Mars"
          },
          {
            question: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            answer: "4"
          }
        ];
        setQuestions(demoQuestions);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  const handleGameEnd = (finalScore) => {
    // Clear session storage
    sessionStorage.removeItem('selectedClass');
    sessionStorage.removeItem('selectedSubject');
    sessionStorage.removeItem('quizId');
    
    alert(`Quiz Complete! Your final score is: ${finalScore}`);
    navigate('/classroom');
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-2xl">Loading quiz...</p>
        <img src="../src/assets/one-boot.gif" alt="Loading" />
      </div>
    );
  }

  return <GameScreen questions={questions} onGameEnd={handleGameEnd} />;
};

export default GameScreenWrapper;