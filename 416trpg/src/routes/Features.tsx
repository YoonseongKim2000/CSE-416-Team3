import "./Features.css";

function Features() {
  return (
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
        <div className="feature-card">
          <h3>General Model</h3>
          <p>The jack of all trades, master of none model. This model is useful for random AI images.</p>

          <p>Recall: ##%</p>
          <p>Precision: ##%</p>
          <p>F1: ##%</p>
        </div>
        <div className="feature-card">
          <h3>Art Model</h3>
          <p>
            This model has been specially trained on many art samples. 
            This model is useful for art AI images.

          </p>

          <p>Recall: ##%</p>
          <p>Precision: ##%</p>
          <p>F1: ##%</p>
        </div>
        <div className="feature-card">
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
  );
}

export default Features;
