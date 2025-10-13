import './SignUp.css'

function SignUp() {
  return (
    <div className='container signup-container d-flex justify-content-center align-items-center'>
        <div className='card shadow-lg signup-card d-flex align-items-center p-4'>
            <h1 className='fw-bold text-center title-style'>Sign Up</h1>
            <form action="#" className='signup-form'>
                <div className='mb-3'>
                    <label htmlFor="email" className='form-label signup-label'>
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
                    <label htmlFor="password" className='form-label signup-label'>
                        Password:
                    </label>
                    <input 
                        type="password" 
                        name='password' 
                        className='form-control'
                        placeholder='Enter your password'
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor="confirm-password" className='form-label signup-label'>
                        Confirm Password:
                    </label>
                    <input 
                        type="password" 
                        name='confirm-password' 
                        className='form-control'
                        placeholder='Confirm your password'
                    />
                </div>
                <p className='mt-5'>By signing up you agree to our Terms and Conditions</p>
                <button type='submit' className='btn submit-button mt-4 w-75 mb-4'>Sign Up</button>
            </form>
        </div>
    </div>
  )
}

export default SignUp