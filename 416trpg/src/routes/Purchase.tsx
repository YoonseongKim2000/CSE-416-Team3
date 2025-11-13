import './Purchase.css'

function PurchasePage () {

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
                            <button className='btn purchasepage-glow-btn mt-4'>Buy Now</button>
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
                            <button className='btn purchasepage-glow-btn mt-4'>Buy Now</button>
                        </div>
                        <div className="purchasepage-feature-card">
                            <h3 className='mb-3'>100 Tokens</h3>
                            <hr />
                            <span className='text-start'><b>Price: </b>$10</span>  
                            <hr />
                            <button className='btn purchasepage-glow-btn mt-4'>Buy Now</button>
                        </div>
                        <div className="purchasepage-feature-card">
                            <h3 className='mb-3'>200 Tokens</h3>
                            <hr />
                            <span className='text-start'><b>Price: </b>$15</span>
                            <hr />                
                            <button className='btn purchasepage-glow-btn mt-4'>Buy Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default PurchasePage