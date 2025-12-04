import './paidFeatures.css'

interface Props {
  handleBtn: () => void
}

function PaidFeatures({handleBtn}: Props) {
  return (
    <div className='d-flex justify-content-center container-fluid flex-wrap pb-5 p-reg'>
        <div className='card mx-4 shadow-lg pop' id='featbr_features_card'>
            <h3 className='subtitle-style fw-bold sp-medium'>Features</h3>
            <hr />
            <p>Price</p>
            <p>Models</p>
            <p>API Tokens</p>
            <p>AI attention data</p>
            <p>Unlimited image analysis</p>
            <p>Analysis confidence percentage</p>
            <p>API documentation</p>
        </div>
        <div className='card mx-4 shadow-lg pop' id='featbr_free_card'>
            <h3 className='subtitle-style fw-bold sp-medium'>Free Tier</h3>
            <hr />
            <p>$0 / Month</p>
            <p>General Model Only</p>
            <p>$X per Token</p>
            <p>❌</p>
            <p>✔</p>
            <p>✔</p>
            <p>✔</p>
        </div>
        <div className='card mx-4 shadow-lg pop'>
            <h3 className='subtitle-style fw-bold sp-medium'>Paid Tier</h3>
            <button onClick={handleBtn} className='btn glow-btn mt-1'>Buy Now</button>
            
            <hr />
            <p>$20 / Month</p>
            <p>General, Art, and Anime</p>
            <p>100 Free Tokens / Month</p>
            <p>✔</p>
            <p>✔</p>
            <p>✔</p>
            <p>✔</p>
        </div>
    </div>
  )
}

export default PaidFeatures