import './Pricing.css'
import PaidFeatures from '../components/paidFeatures'

import { Link, useNavigate, useOutletContext } from "react-router-dom";
import type { AuthOutletContext } from '../App';

function Pricing() {
    const navigate = useNavigate();
    const {contextState, contextSetState} = useOutletContext<AuthOutletContext>();

    const handleBuy = () => {
        console.log(contextState);
        if (contextState && contextState.auth.accessToken) {
            navigate('/purchase');
        } else {
            navigate('/login');
        }
    }

  return (
    <div className="container d-flex justify-content-center text-center py-4">
        <div className="m-4">
            <h1 className="pricing-title-style fw-bold aw-regular">
                <span style={{color: "#727884", textShadow: "0 0 0"}}>Buy the</span> Premium Plan 
                <span style={{color: "#727884", textShadow: "0 0 0"}}> for</span> Improved Image Analysis
            </h1>
            <div className='d-flex justify-content-center container-fluid flex-wrap'>
                <div className='card small-card shadow-lg paid-header-card p-reg pop'>
                    <h2 className='fw-bold subtitle-style m-2 mb-3 sp-medium'>Free Tier</h2>
                    <hr />
                    <p className='fw-bold free-spacing'>$0 / month</p>
                    <p>Image analysis with <br /> <span style={{color: "#960500", fontWeight: "600"}}>1 AI Model</span></p>
                    <p>No free API access ❌</p>
                </div>
                <div className='card small-card shadow-lg paid-header-card p-reg pop'>
                    <div className='align-items-center'>
                        <h2 className='fw-bold subtitle-style sp-medium'>Paid Tier</h2>
                        <button onClick={handleBuy} className='btn glow-btn m-2 buy-btn'>Buy Now</button>
                        
                    </div>
                    <hr />
                    <p className='fw-bold'>$20 / month</p>
                    <p>Image analysis with <br /> <span style={{color: "#09a001", fontWeight: "600"}}>3 AI Models</span></p>
                    <p>Get 100 API tokens at subscription purchase & every following month</p>
                </div>
            </div>
            <h1 className='title-style fw-bold my-5 aw-regular'>Features Breakdown</h1>
            <PaidFeatures handleBtn = {handleBuy}/>
        </div>
    </div>
  )
}

export default Pricing