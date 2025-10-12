import './Login.css'

function Login() {
  return (
    <div className='container d-flex justify-content-center align-items-center'>
        <div className='card shadow-lg login-card d-flex align-items-center p-4'>
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
    </div>
  )
}

export default Login