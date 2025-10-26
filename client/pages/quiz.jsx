import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function Quiz() {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleSubmitBack = () => {
        navigate("/subject");
    };

    return (
        <div>
            <h2>Quiz for {id}</h2>
            <button>Create New Quiz</button>
            <p>question 1</p>
            <button onClick={handleSubmitBack}>Back</button>
            <button>Next</button>
        </div>
    );
}

export default Quiz;