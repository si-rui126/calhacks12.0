import { useNavigate } from "react-router-dom";
import "./style.css";

function Login() {
    const navigate = useNavigate();
    const handleSubmit = () => {
        navigate("/classroom");
    };

    /** Quick Nav buttons specifically for Marian to navigate around because she can't run the backend for some reason :( **/
    // const handleQuickNav = () => {
    //     navigate("/subject/Calculus");
    // };


    return (
        <div className="menu-cont">
            <div className="login-cont">
                <p>
                    Login or Signup
                </p>
                <p>
                    <input name="Username" placeholder="username"/>
                </p>
                <p>
                    <input name="Password" placeholder="password"/>
                </p>
                {/* <button onClick={handleQuickNav}>Quick Nav</button> */}
                <button onClick={handleSubmit}>Enter</button>
            </div>
        </div>

    );
}

export default Login;