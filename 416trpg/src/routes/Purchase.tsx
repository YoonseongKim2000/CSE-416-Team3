import './Purchase.css'
import { ToastContainer, toast } from "react-toastify";

// const apiUrl = import.meta.env.VITE_API_URL

function PurchasePage () {

    const purchaseMonthly = () => {
        // TODO: Backend glorp, if successful run toast.success else run toast.error
        toast.success("Purchase Monthly Successful")
        // toast.error("Purchase Monthly Failed")
    }

    const purchase50 = () => {
        // TODO: Backend glorp, if successful run toast.success else run toast.error
        toast.success("Purchase Token Successful")
        // toast.error("Token Purchase Failed")
    }

    const purchase100 = () => {
        // TODO: Backend glorp, if successful run toast.success else run toast.error
        toast.success("Purchase Token Successful")
        // toast.error("Token Purchase Failed")
    }

    const purchase200 = () => {
        // TODO: Backend glorp, if successful run toast.success else run toast.error
        toast.success("Purchase Token Successful")
        // toast.error("Token Purchase Failed")
    }

    return (
        <div className="purchasetokenpage container-fluid py-5 d-flex justify-content-center align-items-center">
            <div className="w-75">
                <h1 className="mb-4 fw-bold purchasetokentitle">Purchase Product</h1>
                <div className="card border-0 p-4">
                    <span className='text-start purchasepagenormaltext'>
                        <b className='purchasepageboldtext'>Purchase Monthly Access</b>
                    </span>
                    <hr />
                    <div className="purchasepage-feature-row">
                        <div className='text-start d-flex justify-content-center align-items-center'>
                            <div>
                                <b className='text-start'>What you get:</b>
                                <ul className='text-start'>
                                    <li>100 Free tokens each month</li>
                                    <li>Access to the "Art" model</li>
                                    <li>Access to the "Anime" model</li>
                                </ul> 
                            </div>
                            
                        </div>
                        
                        <div className="purchasepage-feature-card">
                            <span className='text-start'><b>Price: </b>$20</span>
                            <hr />                
                            <button className='btn purchasepage-glow-btn mt-4' onClick={purchaseMonthly}>Buy Now</button>
                        </div>
                    </div>
                    
                </div>

                <div className="card border-0 p-4">
                    <span className='text-start purchasepagenormaltext'>
                        <b className='purchasepageboldtext'>Purchase Tokens</b>
                    </span>
                    <hr />
                    <div className="purchasepage-feature-row">
                        <div className="purchasepage-feature-card">
                            <h3 className='mb-3'>50 Tokens</h3>
                            <hr />
                            <span className='text-start'><b>Price: </b>$7</span>  
                            <hr />
                            <button className='btn purchasepage-glow-btn mt-4' onClick={purchase50}>Buy Now</button>
                        </div>
                        <div className="purchasepage-feature-card">
                            <h3 className='mb-3'>100 Tokens</h3>
                            <hr />
                            <span className='text-start'><b>Price: </b>$10</span>  
                            <hr />
                            <button className='btn purchasepage-glow-btn mt-4' onClick={purchase100}>Buy Now</button>
                        </div>
                        <div className="purchasepage-feature-card">
                            <h3 className='mb-3'>200 Tokens</h3>
                            <hr />
                            <span className='text-start'><b>Price: </b>$15</span>
                            <hr />                
                            <button className='btn purchasepage-glow-btn mt-4' onClick={purchase200}>Buy Now</button>
                        </div>
                    </div>
                </div>
            </div>

        {/* Toast container */}
        <ToastContainer position="top-center" autoClose={2500} theme="colored" />

        </div>
    )

}

export default PurchasePage