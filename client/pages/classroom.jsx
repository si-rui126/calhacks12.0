import React from "react";
import { useNavigate } from "react-router-dom";
import "./classroom.css";

function Classroom() {
    const navigate = useNavigate();

    const handleSelectClass = (classId) => {
        navigate("/quiz");
    };

    const classes = [
        { id: 1, name: "Calculus 3", color: "blue-gradient" },
        { id: 2, name: "Subject 2", color: "green-gradient" },
        { id: 3, name: "Subject 3", color: "purple-gradient" },
    ];

    return (
        <div className="classroom-container">
            <div className="classroom-wrapper">
                <div className="classroom-header">
                    <h1 className="classroom-title">My Classes</h1>
                </div>
                
                <div className="classroom-grid">
                    {classes.map((classItem) => (
                        <button
                            key={classItem.id}
                            onClick={() => handleSelectClass(classItem.id)}
                            className="classButton"
                        >
                            <div className={`class-header ${classItem.color}`}>
                                <span className="class-icon">
                                    {classItem.name.charAt(0)}
                                </span>
                            </div>
                            <div className="class-name-container">
                                <h3 className="class-name">
                                    {classItem.name}
                                </h3>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Classroom;