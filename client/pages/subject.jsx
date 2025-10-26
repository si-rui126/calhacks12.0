import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Subject() {
    const { classes: className } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState("");
    const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
    const [error, setError] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");
    const [existingQuizzes, setExistingQuizzes] = useState([]);
    const [loadingQuizzes, setLoadingQuizzes] = useState(false);

    console.log(className);

    // Fetch existing quizzes for this class and subject
    const fetchExistingQuizzes = async () => {
        setLoadingQuizzes(true);
        try {
            const response = await fetch(`http://localhost:8080/api/quizzes/by-class-subject?class_name=${encodeURIComponent(className)}&subject=${encodeURIComponent(subject)}`);
            const data = await response.json();
            
            if (data.success) {
                setExistingQuizzes(data.quizzes || []);
            } else {
                console.error("Error fetching quizzes:", data.error);
                setExistingQuizzes([]);
            }
        } catch (error) {
            console.error("Error fetching quizzes:", error);
            setExistingQuizzes([]);
        } finally {
            setLoadingQuizzes(false);
        }
    };

    // Load quizzes when subject changes
    React.useEffect(() => {
        if (subject.trim()) {
            fetchExistingQuizzes();
        } else {
            setExistingQuizzes([]);
        }
    }, [subject, className]);

    const handleCreateQuiz = async () => {
        if (!subject.trim()) {
            setError("Please enter a subject/topic");
            return;
        }

        setIsCreatingQuiz(true);
        setError("");

        try {
            // Call backend to create quiz
            const response = await fetch('http://localhost:8080/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `Generate practice questions for ${subject}`,
                    class_name: className,
                    subject: subject
                }),
            });

            const data = await response.json();
            console.log("Quiz created:", data);

            if (data.response && data.response.quiz_data) {
                // Generate unique quiz ID
                const quizId = `${className}_${subject}_${Date.now()}`;
                
                // Prepare quiz data with ID
                const quizData = {
                    ...data.response,
                    quiz_id: quizId
                };

                // Save quiz to database
                const saveResponse = await fetch('http://localhost:8080/api/quizzes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(quizData),
                });

                const saveData = await saveResponse.json();
                console.log("Quiz saved:", saveData);

                if (saveData.success) {
                    // Store quiz ID and navigate to gamescreen
                    sessionStorage.setItem('selectedClass', className);
                    sessionStorage.setItem('selectedSubject', subject);
                    sessionStorage.setItem('quizId', quizId);
                    
                    // Refresh quiz list
                    fetchExistingQuizzes();
                    
                    // Navigate to gamescreen
                    navigate('/gamescreen');
                } else {
                    setError("Failed to save quiz. Please try again.");
                }
            } else {
                setError("Failed to create quiz. Please try again.");
            }
        } catch (error) {
            console.error("Error creating quiz:", error);
            setError(`Failed to create quiz: ${error.message}`);
        } finally {
            setIsCreatingQuiz(false);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file type
            if (file.type !== 'application/pdf') {
                setError("Please select a PDF file only.");
                return;
            }
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError("File size must be less than 10MB.");
                return;
            }
            setSelectedFile(file);
            setError("");
            setUploadStatus("");
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setError("Please select a file to upload.");
            return;
        }

        setIsUploading(true);
        setError("");
        setUploadStatus("Uploading and processing file...");

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('user_id', 'demo'); // You can get this from session

            console.log('Uploading file:', selectedFile.name, 'Size:', selectedFile.size, 'Type:', selectedFile.type);
            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const response = await fetch('http://localhost:8080/api/upload', {
                method: 'POST',
                body: formData,
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            const data = await response.json();
            console.log("Upload response:", data);

            if (response.ok) {
                setUploadStatus("File uploaded and processed successfully!");
                setSelectedFile(null);
                // Reset file input
                const fileInput = document.getElementById('file-input');
                if (fileInput) fileInput.value = '';
            } else {
                setError(`Upload failed: ${data.error || 'Unknown error'}`);
                setUploadStatus("");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setError(`Failed to upload file: ${error.message}`);
            setUploadStatus("");
        } finally {
            setIsUploading(false);
        }
    };

    const handleStartSpecificQuiz = (quizId) => {
        // Store quiz ID and navigate to gamescreen
        sessionStorage.setItem('selectedClass', className);
        sessionStorage.setItem('selectedSubject', subject);
        sessionStorage.setItem('quizId', quizId);
        
        // Navigate to gamescreen
        navigate('/gamescreen');
    };

    const handleSubmitBack = () => {
        navigate("/classroom");
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>{className}</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Subject/Topic:
                </label>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Derivatives, World War II, Shakespeare"
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '1rem',
                        border: '2px solid #ccc',
                        borderRadius: '5px'
                    }}
                />
                {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}
            </div>

            {/* File Upload Section */}
            <div style={{ marginBottom: '20px', padding: '15px', border: '2px dashed #ccc', borderRadius: '5px' }}>
                <h3 style={{ marginBottom: '10px', fontSize: '1.2rem' }}>Upload Reference Material (PDF)</h3>
                <input
                    id="file-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    style={{ marginBottom: '10px' }}
                />
                {selectedFile && (
                    <div style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#666' }}>
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                )}
                <button
                    onClick={handleFileUpload}
                    disabled={!selectedFile || isUploading}
                    style={{
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        backgroundColor: selectedFile && !isUploading ? '#4CAF50' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: selectedFile && !isUploading ? 'pointer' : 'not-allowed'
                    }}
                >
                    {isUploading ? 'Processing...' : 'Upload & Process'}
                </button>
                {uploadStatus && (
                    <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#4CAF50' }}>
                        {uploadStatus}
                    </div>
                )}
            </div>

            {/* Existing Quizzes Section */}
            {subject.trim() && (
                <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <h3 style={{ marginBottom: '10px', fontSize: '1.2rem' }}>Existing Quizzes for "{subject}"</h3>
                    {loadingQuizzes ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <p>Loading quizzes...</p>
                        </div>
                    ) : existingQuizzes.length > 0 ? (
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {existingQuizzes.map((quiz, index) => (
                                <div key={quiz._id || index} style={{ 
                                    padding: '10px', 
                                    marginBottom: '8px', 
                                    border: '1px solid #eee', 
                                    borderRadius: '5px',
                                    backgroundColor: '#f9f9f9'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong>Quiz {index + 1}</strong>
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                                Created: {quiz.date || 'Unknown date'}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                                ID: {quiz.quiz_id || 'No ID'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                            <p>No existing quizzes found for this subject.</p>
                            <p style={{ fontSize: '0.9rem' }}>Create a new quiz using the button below.</p>
                        </div>
                    )}
                </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={handleCreateQuiz}
                    disabled={isCreatingQuiz}
                    style={{
                        flex: 1,
                        padding: '12px',
                        fontSize: '1rem',
                        backgroundColor: isCreatingQuiz ? '#ccc' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: isCreatingQuiz ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isCreatingQuiz ? 'Creating Quiz...' : 'Create Quiz'}
                </button>
                
                {/* Dropdown for existing quizzes */}
                <div style={{ flex: 1, position: 'relative' }}>
                    <select
                        onChange={(e) => {
                            if (e.target.value) {
                                handleStartSpecificQuiz(e.target.value);
                            }
                        }}
                        value=""
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '1rem',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="" disabled>
                            {existingQuizzes.length > 0 ? 'Start Existing Quiz' : 'No Quizzes Available'}
                        </option>
                        {existingQuizzes.map((quiz, index) => (
                            <option key={quiz._id || index} value={quiz.quiz_id} style={{ color: 'black' }}>
                                Quiz {index + 1} - {quiz.date || 'Unknown Date'}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                onClick={handleSubmitBack}
                style={{
                    marginTop: '20px',
                    width: '100%',
                    padding: '10px',
                    fontSize: '1rem',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Back to Classes
            </button>
        </div>
    );
}

export default Subject;