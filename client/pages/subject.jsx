import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Subject() {
    const { classes: className } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState("");
    const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
    const [error, setError] = useState("");

    console.log(className);

    const handleStartQuiz = () => {
        // Store class and subject info in session storage
        sessionStorage.setItem('selectedClass', className);
        sessionStorage.setItem('selectedSubject', subject || 'General');
        
        // Navigate to gamescreen
        navigate('/gamescreen');
    };

    const handleCreateQuiz = async () => {
        if (!subject.trim()) {
            setError("Please enter a subject/topic");
            return;
        }

        setIsCreatingQuiz(true);
        setError("");

        try {
            // Call backend to create quiz
            const response = await fetch('http://localhost:8080/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `Generate practice questions for ${subject}`,
                    class_name: className,
                    subject: subject
                }),
            });

            const data = await response.json();
            console.log("Quiz created:", data);

            if (data.response && data.response.quiz_data) {
                // Generate unique quiz ID
                const quizId = `${className}_${subject}_${Date.now()}`;
                
                // Prepare quiz data with ID
                const quizData = {
                    ...data.response,
                    quiz_id: quizId
                };

                // Save quiz to database
                const saveResponse = await fetch('http://localhost:8080/api/quizzes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(quizData),
                });

                const saveData = await saveResponse.json();
                console.log("Quiz saved:", saveData);

                if (saveData.success) {
                    // Store quiz ID and navigate to gamescreen
                    sessionStorage.setItem('selectedClass', className);
                    sessionStorage.setItem('selectedSubject', subject);
                    sessionStorage.setItem('quizId', quizId);
                    
                    // Navigate to gamescreen
                    navigate('/gamescreen');
                } else {
                    setError("Failed to save quiz. Please try again.");
                }
            } else {
                setError("Failed to create quiz. Please try again.");
            }
        } catch (error) {
            console.error("Error creating quiz:", error);
            setError(`Failed to create quiz: ${error.message}`);
        } finally {
            setIsCreatingQuiz(false);
        }
    };

    const handleSubmitBack = () => {
        navigate("/classroom");
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>{className}</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Subject/Topic:
                </label>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Derivatives, World War II, Shakespeare"
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '1rem',
                        border: '2px solid #ccc',
                        borderRadius: '5px'
                    }}
                />
                {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={handleCreateQuiz}
                    disabled={isCreatingQuiz}
                    style={{
                        flex: 1,
                        padding: '12px',
                        fontSize: '1rem',
                        backgroundColor: isCreatingQuiz ? '#ccc' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: isCreatingQuiz ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isCreatingQuiz ? 'Creating Quiz...' : 'Create Quiz'}
                </button>
                
                <button
                    onClick={handleStartQuiz}
                    style={{
                        flex: 1,
                        padding: '12px',
                        fontSize: '1rem',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Start Existing Quiz
                </button>
            </div>

            <button
                onClick={handleSubmitBack}
                style={{
                    marginTop: '20px',
                    width: '100%',
                    padding: '10px',
                    fontSize: '1rem',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Back to Classes
            </button>
        </div>
    );
}

export default Subject;