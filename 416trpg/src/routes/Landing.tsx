import { Link, useNavigate, useOutletContext } from "react-router-dom";
import "./Landing.css";
import PaidFeatures from "../components/paidFeatures";
import Features from "./Features";
import type { AuthOutletContext } from "../App";

function LandingPage() {
  const navigate = useNavigate();
  const {contextState} = useOutletContext<AuthOutletContext>();

  const handleBuy = () => {
    console.log(contextState);
      if (contextState && contextState.auth.accessToken) {
          navigate('/purchase');
      } else {
          navigate('/login');
      }
  }
  return (
    <div>

        <div className="landing-page container-fluid p-reg mb-5 mt-4">
          <div className="row align-items-center h-100 containerPicturesCustom">
            {/* Left collage */}
            <div className="col-lg-3 d-none d-lg-block collage left-collage">
              <img src="/CSE-416-Team3/AI1.jpg" alt="collage left 1" />
              <img src="/CSE-416-Team3/AI2.jpg" alt="collage left 2" />
              <img src="/CSE-416-Team3/AI3.jpg" alt="collage left 3" />
              <img src="/CSE-416-Team3/AI4.jpg" alt="collage left 4" />
              <img src="/CSE-416-Team3/xmark.png" alt="X mark" className="override" />
            </div>

            {/* Center content */}
            <div className="col-lg-6 d-flex flex-column align-items-center justify-content-center text-center middle-content welcomeZoverride">
              <div className="landing-card p-5 shadow-lg">
                <h1 className="fw-bold mb-3 aw-regular">Welcome to TrueVision</h1>
                <p className="text-dark mb-4">
                  AI v.s. AI: Analyse if images are REAL or GENERATED.
                </p>
                <p className="text-dark mb-4">
                    Our models are trained to analyse all accepted image formats to determine if they are real or have been AI-generated
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
              <img src="/CSE-416-Team3/human1.jpg" alt="collage right 1" />
              <img src="/CSE-416-Team3/human2.jpg" alt="collage right 2" />
              <img src="/CSE-416-Team3/human3.PNG" alt="collage right 3" />
              <img src="/CSE-416-Team3/human4.png" alt="collage right 3" />
              <img src="/CSE-416-Team3/checkmark.png" alt="collage right 3" className="override checkoffset"/>
            </div>
          </div>
        </div>

        {/* PUT OTHER STUFF HERE */}
        <PaidFeatures handleBtn={handleBuy}/>
        <Features/>
    </div>
    
  );
}

export default LandingPage;
