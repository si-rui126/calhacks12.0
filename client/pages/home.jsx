import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from "./login";
import Classroom from "./classroom";
import Subject from "./subject";
import Quiz from "./gamescreen";

function Home() {

    return (
        <div>
            <h2>Kaboot!</h2>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/classroom" element={<Classroom />} />
                    <Route path="/subject/:classes" element={<Subject />} />
                    <Route path="/gamescreen" element={<Quiz />} />               
                </Routes>               
            </Router>
        </div>
    );
}

export default Home;