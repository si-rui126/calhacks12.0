import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClassCard from "../component/classcard";

function Classroom() {
    const navigate = useNavigate();
    const [className, setClassName] = useState("");
    const [classes, setClasses] = useState([]);
    const [userEmail, setUserEmail] = useState("");
    const [loading, setLoading] = useState(true);

    const handleSelectClass = (classId) => {
        navigate("/quiz");
    };

    // Fetch classes from the server
    const fetchClasses = async (email) => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${email}/classes`);
            const data = await response.json();
            
            if (data.success && data.classes) {
                const colorOptions = ["blue-gradient", "green-gradient", "purple-gradient", "orange-gradient", "pink-gradient"];
                const formattedClasses = data.classes.map((className, index) => ({
                    id: index + 1,
                    name: className,
                    color: colorOptions[index % colorOptions.length]
                }));
                setClasses(formattedClasses);
            } else {
                setClasses([]);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
            setClasses([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch session and load classes
    useEffect(() => {
        const loadUserData = async () => {
            try {
                // Get current session email
                const sessionResponse = await fetch(`http://localhost:8080/api/session`);
                const sessionData = await sessionResponse.json();
                console.log(sessionData.email);
                console.log(sessionData.success);
    
                if (sessionData.success && sessionData.email) {
                    setUserEmail(sessionData.email);
                    await fetchClasses(sessionData.email);
                } else {
                    console.error("No session found");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error loading user data:", error);
                setLoading(false);
            }
        };
    
        loadUserData();
    }, []);

    // Function to create a test user if they don't exist
    const createTestUser = async (email) => {
        try {
            const response = await fetch(`http://localhost:8080/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: "Test User",
                    email: email,
                    password: "test123",
                    classes: []
                }),
            });
            const data = await response.json();
            console.log("User creation response:", data);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const handleAddClass = async () => {
        if (!className.trim()) {
            alert("Please enter a class name");
            return;
        }

        if (!userEmail) {
            alert("No user email found. Please try logging in again.");
            return;
        }
        
        // Check if user exists, if not create them
        try {
            const checkUser = await fetch(`http://localhost:8080/api/users/${userEmail}`);
            if (!checkUser.ok) {
                console.log("User not found, creating new user...");
                await createTestUser(userEmail);
            }
        } catch (error) {
            console.log("Error checking user, attempting to create...");
            await createTestUser(userEmail);
        }
        
        try {
            console.log("Attempting to add class:", className, "for user:", userEmail);
            
            const response = await fetch(`http://localhost:8080/api/users/${userEmail}/classes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ class_name: className }),
            });

            console.log("Response status:", response.status);
            const data = await response.json();
            console.log("Response data:", data);
            
            if (data.success) {
                setClassName("");
                console.log("Class added successfully!");
                // Refresh classes from server
                await fetchClasses(userEmail);
                alert("Class added successfully!");
            } else {
                console.error("Error response:", data);
                alert(`Error adding class: ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error adding class:", error);
            alert(`Failed to add class: ${error.message}. Make sure the Flask server is running on port 8080.`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddClass();
        }
    };

    if (loading) {
        return (
            <div className="classroom-container">
                <div className="classroom-wrapper">
                    <div className="classroom-header">
                        <h1 className="classroom-title">My Classes</h1>
                    </div>
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <h2>Loading your classes...</h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="classroom-container">
            <div className="classroom-wrapper">
                <div className="classroom-header">
                    <h1 className="classroom-title">My Classes</h1>
                </div>
                
                <div className="classroom-grid">
                    {classes.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
                            <h2>No classes yet. Add your first class below!</h2>
                        </div>
                    ) : (
                        classes.map((classItem) => (
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
                        ))
                    )}
                </div>
            </div>
            
            <div className="add-class-container">
                <input
                    type="text"
                    className="add-class-input"
                    placeholder="Enter class name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button
                    className="add-class-button"
                    onClick={handleAddClass}
                >
                    Add Class
                </button>
            </div>
        </div>
    );
}

export default Classroom;