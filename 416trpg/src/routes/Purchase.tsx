import './Purchase.css'
import { ToastContainer, toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_API_URL
const selfUrl = import.meta.env.SELF_URL

function PurchasePage () {

    const purchaseMonthly = async () => {
        const token = localStorage.getItem("accessToken");
        if (token === null) {
            toast.warning("Please Login First");
            return;
        }

        try {
            const response = await fetch(apiUrl + "purchase/monthly", {
                method: "POST",
                credentials: "include",  // optional if you don't need cookies
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": selfUrl,
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok){
                toast.success("Purchase Monthly Successful");
            } else {
                toast.error("Error-"+response.status);
            };
        } catch (error) {
            toast.error("" + error)
        };
    }

    const purchase50 = async () => {
        const token = localStorage.getItem("accessToken");
        if (token === null) {
            toast.warning("Please Login First");
            return;
        }

        try {
            const response = await fetch(apiUrl + "purchase/50", {
                method: "POST",
                credentials: "include",  // optional if you don't need cookies
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": selfUrl,
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok){
                toast.success("Purchase 50 Tokens Successful");
            } else {
                toast.error("Error-"+response.status);
            };
        } catch (error) {
            toast.error("" + error)
        };
    }

    const purchase100 = async () => {
        const token = localStorage.getItem("accessToken");
        if (token === null) {
            toast.warning("Please Login First");
            return;
        }

        try {
            const response = await fetch(apiUrl + "purchase/100", {
                method: "POST",
                credentials: "include",  // optional if you don't need cookies
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": selfUrl,
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok){
                toast.success("Purchase 100 Tokens Successful");
            } else {
                toast.error("Error-"+response.status);
            };
        } catch (error) {
            toast.error("" + error)
        };
    }

    const purchase200 = async () => {
        const token = localStorage.getItem("accessToken");
        if (token === null) {
            toast.warning("Please Login First");
            return;
        }

        try {
            const response = await fetch(apiUrl + "purchase/200", {
                method: "POST",
                credentials: "include",  // optional if you don't need cookies
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": selfUrl,
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok){
                toast.success("Purchase 200 Tokens Successful");
            } else {
                toast.error("Error-"+response.status);
            };
        } catch (error) {
            toast.error("" + error)
        };
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