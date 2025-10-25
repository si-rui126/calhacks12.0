import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function Subject() {
    const { classes } = useParams();
    const navigate = useNavigate();

    console.log(classes);

    const handleStartQuiz = () => {
        // navigate(`/quiz/${title}`);
        navigate('/gamescreen');
    };

    const handleSubmitBack = () => {
        navigate("/classroom");
    };

    return (
        <div>
            <h2>{classes}</h2>
            <button onClick={handleSubmitBack}>Back to classes</button>
            <button onClick={handleStartQuiz}>Start Quiz</button>
        </div>
    );
}

export default Subject;