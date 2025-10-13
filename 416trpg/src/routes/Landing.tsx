import { Link } from "react-router-dom";
import "./Landing.css";

function LandingPage() {
  return (
    <div>

        <div className="landing-page container-fluid">
          <div className="row align-items-center h-100 containerPicturesCustom">
            {/* Left collage */}
            <div className="col-lg-3 d-none d-lg-block collage left-collage">
              <img src="/src/assets/AI1.jpg" alt="collage left 1" />
              <img src="/src/assets/AI2.jpg" alt="collage left 2" />
              <img src="/src/assets/AI3.jpg" alt="collage left 3" />
              <img src="/src/assets/AI4.jpg" alt="collage left 4" />
              <img src="/src/assets/xmark.png" alt="X mark" className="override" />
            </div>

            {/* Center content */}
            <div className="col-lg-6 d-flex flex-column align-items-center justify-content-center text-center middle-content welcomeZoverride">
              <div className="landing-card p-5 shadow-lg">
                <h1 className="fw-bold mb-3">Welcome to TrueVision</h1>
                <p className="text-dark mb-4">
                  AI v.s. AI: Analyse if images are REAL or GENERATED.
                </p>
                <p className="text-dark mb-4">
                    Our models are trained to accurately analyse all accepted image formats to determine if they are real or have been AI-generated
                </p>

                
                  <Link to="/home">
                    <button
                        type="button"
                        className="button-82-pushable landScanBTNcustom"
                        >
                        <span className="button-82-shadow"></span>
                        <span className="button-82-edge"></span>
                        <span className="button-82-front text">Start Scanning</span>
                    </button>
                  </Link>
                
              </div>
            </div>

            {/* Right collage */}
            <div className="col-lg-3 d-none d-lg-block collage right-collage">
              <img src="/src/assets/human1.jpg" alt="collage right 1" />
              <img src="/src/assets/human2.jpg" alt="collage right 2" />
              <img src="/src/assets/human3.png" alt="collage right 3" />
              <img src="/src/assets/human4.png" alt="collage right 3" />
              <img src="/src/assets/checkmark.png" alt="collage right 3" className="override checkoffset"/>
            </div>
          </div>
        </div>

        {/* PUT OTHER STUFF HERE */}

        <div className="features-container">
        {/* Main card */}
        <div className="main-card">
          <h2>Welcome to Our Models</h2>
          <p>
            Our models have been trained and fine-tuned to meet your needs. 
            Each model we release has been thoroughly tested to ensure that AI images and human images detected. 
            Currently, we offer 3 models and details can be found below.
          </p>

        </div>

        {/* Three feature cards */}
        <div className="feature-row">
          <div className="landing-feature-card">
            <h3>General Model</h3>
            <p>The jack of all trades, master of none model. This model is useful for random AI images.</p>

            <p>Recall: ##%</p>
            <p>Precision: ##%</p>
            <p>F1: ##%</p>
          </div>
          <div className="landing-feature-card">
            <h3>Art Model</h3>
            <p>
              This model has been specially trained on many art samples. 
              This model is useful for art AI images.

            </p>

            <p>Recall: ##%</p>
            <p>Precision: ##%</p>
            <p>F1: ##%</p>
          </div>
          <div className="landing-feature-card">
            <h3>Anime Model</h3>

            <p>
              Introducing our new Anime model. 
              Trained on a dataset of anime style images, this model is useful for detecting anime style AI images.
            </p>

            <p>Recall: ##%</p>
            <p>Precision: ##%</p>
            <p>F1: ##%</p>
          </div>
        </div>
    </div>
    </div>
    
  );
}

export default LandingPage;
