import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClassCard from "../component/classcard";

function Classroom() {
    const navigate = useNavigate();
    const [className, setClassName] = useState("");
    const [classes, setClasses] = useState([]);
    const [userEmail, setUserEmail] = useState("");
    const [loading, setLoading] = useState(true);

    const handleSelectClass = (className) => {
        navigate(`/subject/${className}`);
    };

    const handleDeleteClass = async (className) => {
        if (!window.confirm(`Are you sure you want to delete the class "${className}"? This action cannot be undone.`)) {
            return;
        }

        if (!userEmail) {
            alert("No user email found. Please try logging in again.");
            return;
        }

        try {
            // Remove class from user's classes array
            const response = await fetch(`http://localhost:8080/api/users/${userEmail}/classes/${className}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            console.log("Delete response:", data);

            if (data.success) {
                // Update UI by removing the class
                setClasses(prevClasses => prevClasses.filter(cls => cls.name !== className));
                alert(`Class "${className}" deleted successfully!`);
            } else {
                alert(`Error deleting class: ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error deleting class:", error);
            alert(`Failed to delete class: ${error.message}`);
        }
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
                
                // Optimistically update the UI instead of refetching
                const colorOptions = ["blue-gradient", "green-gradient", "purple-gradient", "orange-gradient", "pink-gradient"];
                const newClass = {
                    id: classes.length + 1,
                    name: className,
                    color: colorOptions[classes.length % colorOptions.length]
                };
                setClasses([...classes, newClass]);
                
                // Optional: sync with server in background (non-blocking)
                fetchClasses(userEmail);
            } else {
                console.error("Error response:", data);
                
                // If user not found, create them and retry once
                if (data.error && data.error.includes("not found")) {
                    console.log("User not found, creating user...");
                    await createTestUser(userEmail);
                    
                    // Retry adding the class with a direct API call
                    const retryResponse = await fetch(`http://localhost:8080/api/users/${userEmail}/classes`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ class_name: className }),
                    });
                    const retryData = await retryResponse.json();
                    
                    if (retryData.success) {
                        setClassName("");
                        const colorOptions = ["blue-gradient", "green-gradient", "purple-gradient", "orange-gradient", "pink-gradient"];
                        const newClass = {
                            id: classes.length + 1,
                            name: className,
                            color: colorOptions[classes.length % colorOptions.length]
                        };
                        setClasses([...classes, newClass]);
                    } else {
                        alert(`Error adding class: ${retryData.error || 'Unknown error'}`);
                    }
                } else {
                    alert(`Error adding class: ${data.error || 'Unknown error'}`);
                }
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
                            <div key={classItem.id} className="class-item-container" style={{ position: 'relative' }}>
                                <button
                                    onClick={() => handleSelectClass(classItem.name)}
                                    className="classButton"
                                    style={{ width: '100%' }}
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
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClass(classItem.name);
                                    }}
                                    className="delete-class-btn"
                                    style={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        background: '#ff4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '25px',
                                        height: '25px',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 10
                                    }}
                                    title="Delete class"
                                >
                                    ×
                                </button>
                            </div>
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