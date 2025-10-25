import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function Subject() {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleStartQuiz = () => {
        // navigate(`/quiz/${id}`);
        navigate('/quiz');
    };

    const handleSubmitBack = () => {
        navigate("/classroom");
    };

    return (
        <div>
            <h2>Subject Name</h2>
            <button onClick={handleSubmitBack}>Back to classes</button>
            <button onClick={handleStartQuiz}>Start Quiz</button>
        </div>
    );
}

export default Subject;