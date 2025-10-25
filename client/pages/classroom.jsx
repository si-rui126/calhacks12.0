import React from "react";
import { useNavigate } from "react-router-dom";

function Classroom() {
    const navigate = useNavigate();

    const handleSelectClass = (classId) => {
        navigate("/quiz");
    };

    return (
        <div>
            <h2>My Classes</h2>
            <button onClick={() => handleSelectClass()}>Calculus 3</button>
            <button>Subject 2</button>
            <button>Subject 3</button>
        </div>

    );
}

export default Classroom;