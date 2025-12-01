import './Login.css'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { generateHash } from '../utilities/hashutils'
import { ToastContainer, toast } from 'react-toastify'
import { type AuthOutletContext } from '../App'
import { useRef } from 'react'

const apiUrl = import.meta.env.VITE_API_URL
const selfUrl = import.meta.env.SELF_URL

function Login() {
    const navigate = useNavigate();
    const {contextState, contextSetState} = useOutletContext<AuthOutletContext>();
    const ref = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const email = e.target.elements.email.value;
        const pw = e.target.elements.password.value;

        if (!email || !pw) {
            toast.error("Please fill in all fields");
            return;
        }

        if (email.length > 72 || pw.length > 72) {
            toast.error("Inputs too long, keep under 72 characters");
            return;
        }

        const hashedPw = generateHash(email, pw);


        const loginData = {email: email, password: hashedPw};

        try {
            const response = await fetch(apiUrl + "access/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": selfUrl,
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (response.status == 500) {
                toast.error("Error: Internal server error");
            } else if (response.status == 403) {
                toast.error(result.detail);
                if (ref.current) {
                    ref.current.value = '';
                }
            } else {
                const accessToken = result.accessToken;
                const email = result.email;
                localStorage.setItem('email', email);
                localStorage.setItem('accessToken', accessToken);
                contextSetState({auth:{email: email, accessToken: accessToken}});
                //toast.success("Logged In");
                navigate('/home');
            }
        } catch (err) {
            console.log(err);
            toast.error("" + (err))
        }
    }

    return (
        <div className='container login-container d-flex justify-content-center align-items-center p-reg'>
            <div className='card small-card shadow-lg login-card d-flex align-items-center p-4'>
                <h1 className='fw-bold text-center title-style aw-regular'>Log In</h1>
                <form onSubmit={handleSubmit} className='login-form'>
                    <div className='mb-3'>
                        <label htmlFor="email" className='form-label login-label'>
                            Email:
                        </label>
                        <input 
                            type="email" 
                            name='email' 
                            className='form-control'
                            placeholder='Enter your email'
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password" className='form-label login-label'>
                            Password:
                        </label>
                        <input 
                            ref={ref}
                            type="password" 
                            name='password' 
                            className='form-control'
                            placeholder='Enter your password'
                        />
                    </div>
                    <button type='submit' className='btn btnb submit-button mt-4 w-75 mb-4'>Log In</button>
                </form>
                <Link to="/signup">
                    <small>Don't have an account? Click here to signup</small>
                </Link>
                
            </div>
            <ToastContainer position='top-center' autoClose={2500} theme='colored'/>
        </div>
    )
}

export default Login