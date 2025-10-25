import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClassCard from "../component/classcard";

function Classroom() {

    const subjects = [
        { id: 1, classes: "Calculus 3" },
        { id: 2, classes: "Physics 2" },
        { id: 3, classes: "Linear Algebra" },
        { id: 4, classes: "Biology" },
    ];

    useEffect(() => {
        // Simulate fetching from API
        setTimeout(() => {
        }, 500);
    }, []);

    return (
    <div className="page-container">
      <h1>My Classes</h1>
      <div className="classes-grid">
        {subjects.map((cls) => (
          <ClassCard id={cls.id} title={cls.classes} onClick={() => handleSelectClass()}/>
        ))}
      </div>
    </div>

    );
}

export default Classroom;