import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./results.css";

function ResultsPage() {
  const location = useLocation();
  const { result, model } = location.state || {};

  const [gaugeAngle, setGaugeAngle] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    { src: result?.original_image, title: "Original Image" },
    { src: result?.attention_heatmap, title: "Attention Heatmap" },
    { src: result?.masked_overlay, title: "Masked Overlay" },
  ];

  useEffect(() => {
    if (result) {
      let start = 0;
      const end = result.confidence * 180;
      const step = end / 50;
      const interval = setInterval(() => {
        start += step;
        if (start >= end) {
          setGaugeAngle(end);
          clearInterval(interval);
        } else {
          setGaugeAngle(start);
        }
      }, 10);
      return () => clearInterval(interval);
    }
  }, [result]);

  if (!result) {
    return (
      <div className="container py-5 text-center">
        <h1>No result data found. Please analyze an image first.</h1>
      </div>
    );
  }

  const confidencePercent = (result.confidence * 100).toFixed(1);

  return (
    <div className="d-flex justify-content-center py-5">
      <div className="card p-4 shadow cardCustom" style={{ width: "80%" }}>
        {/* Model info */}
        <div className="text-center mb-4">
          <h5 className="text-secondary">Model Used</h5>
          <h3 className="fw-bold text-primary">{model}</h3>
        </div>

        {/* Top section */}
        <div className="row align-items-center mb-5">
          {/* Left: prediction text */}
          <div className="col-md-6 text-center text-md-start mb-4 mb-md-0">
            <h4 className="text-muted">Our analysis says this image is:</h4>
            <h1 className="fw-bold display-5 text-success">
              {result.predicted_class === 1 ? "Human" : "AI"}
            </h1>
          </div>

          {/* Divider */}
          <div className="col-md-1 d-none d-md-flex justify-content-center">
            <div className="divider"></div>
          </div>

          {/* Right: animated confidence gauge */}
          <div className="col-md-5 text-center">
            <div className="confidence-gauge">
              <div
                className="gauge-fill"
                style={{
                  background: `conic-gradient(
                    from 180deg, 
                    var(--bs-primary) 0% ${result.confidence * 100}%, 
                    #e9ecef ${result.confidence * 100}% 100%
                  )`,
                }}
              ></div>

              <div className="gauge-cover">
                <span className="confidence-text">{confidencePercent}%</span>
              </div>
            </div>
            <h5 className="text-muted mt-2">Confidence</h5>
          </div>
        </div>

        {/* Bottom carousel gallery */}
        <div id="resultCarousel" className="carousel slide carousel-img" data-bs-ride="carousel">
          <div className="carousel-inner">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`carousel-item ${idx === 0 ? "active" : ""}`}
              >
                <img
                  src={`data:image/png;base64,${img.src}`}
                  className="d-block w-100 rounded shadow-sm"
                  alt={img.title}
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>{img.title}</h5>
                </div>
              </div>
            ))}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#resultCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#resultCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
