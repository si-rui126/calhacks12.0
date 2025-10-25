import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from "./login";
import Classroom from "./classroom";
import Subject from "./subject";
import Quiz from "./quiz";

function Home() {
    return (
        <div>
            <h2>Kaboot!</h2>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/classroom" element={<Classroom />} />
                    <Route path="/subject" element={<Subject />} />
                    <Route path="/quiz" element={<Quiz />} />
                </Routes>
            </Router>
        </div>

    );
}

export default Home;