import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { generateHash } from '../utilities/hashutils'
import { ToastContainer, toast } from 'react-toastify'

const apiUrl = import.meta.env.VITE_API_URL

function Login() {
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const email = e.target.elements.email.value;

        if (!email || !e.target.elements.password.valu) {
            toast.error("Please fill in all fields");
            return;
        }

        const hashedPw = generateHash(email, e.target.elements.password.value);


        const loginData = {email: email, password: hashedPw};

        try {
            const response = await fetch(apiUrl + "user/login", {
                method: "POST",
                credentials: "include",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (response.status == 500) {
                toast.error("Error: Internal server error");
            } else if (response.status == 403) {
                toast.error(result.detail);
            } else {
                const accessToken = result.accessToken;
                const email = result.email;
                //TODO: keep login state code here
                toast.success("Logged In");
                //navigate('/home');
            }
        }
    }

    return (
        <div className='container login-container d-flex justify-content-center align-items-center'>
            <div className='card small-card shadow-lg login-card d-flex align-items-center p-4'>
                <h1 className='fw-bold text-center title-style'>Log In</h1>
                <form action="#" className='login-form'>
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
                            type="password" 
                            name='password' 
                            className='form-control'
                            placeholder='Enter your password'
                        />
                    </div>
                    <button type='submit' className='btn submit-button mt-4 w-75 mb-4'>Log In</button>
                </form>
            </div>
            <ToastContainer position='top-center' autoClose={2500} theme='color'/>
        </div>
    )
}

export default Login