import "./Features.css";
import evil from '../assets/scannie-general-cursed.png'
import neutral from '../assets/unnamed.png'
import cute from '../assets/scannie-anime-kawaii.png'

function Features() {
  return (
    <div className="features-container">
      {/* Main card */}
      <div className="f-main-card">
        <h2 className="aw-regular">Welcome to Our Models</h2>
        <p className="p-reg">
          Our models have been trained and fine-tuned to meet your needs. 
          Each model we release has been thoroughly tested to ensure that AI images and human images detected. 
          Currently, we offer 3 models and details can be found below.
        </p>

      </div>

      {/* Three feature cards */}
      <div className="feature-row">
        <div className="feature-card p-reg">
          <img className="scannie-lrg" src={evil} alt="scannie mascot in general blue" />
          <h3 className="sp-medium">General Model</h3>
          <p>The jack of all trades, master of none model. This model is useful for random AI images and works best identifying human photos.</p>

          <p>Recall: 98.77%</p>
          <p>Precision: 98.72%</p>
          <p>F1: 0.9874072221</p>
        </div>
        <div className="feature-card p-reg">
          <img className="scannie-lrg"  src={neutral} alt="scannie mascot in art orange" />
          <h3 className="sp-medium">Art Model</h3>
          <p>
            This model has been specially trained on many art samples. 
            This model is useful for art AI images.

          </p>

          <p>Recall: 100%</p>
          <p>Precision: 99.9%</p>
          <p>F1: 0.9994997499</p>
        </div>
        <div className="feature-card p-reg">
          <img className="scannie-lrg"  src={cute} alt="scannie mascot in anime purple" />
          <h3 className="sp-medium">Anime Model</h3>

          <p>
            Introducing our new Anime model. 
            Trained on a dataset of anime style images, this model is useful for detecting anime style AI images.
          </p>

          <p>Recall: 99.96%</p>
          <p>Precision: 100%</p>
          <p>F1: 0.9998333056</p>
        </div>
      </div>
    </div>
  );
}

export default Features;
