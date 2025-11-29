import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./results.css";

type HistoryRecord = {
  filename: string;
  image: string;
  model: string;
  classification: number;
  confidence: number;
}

const apiUrl = import.meta.env.VITE_API_URL
const selfUrl = import.meta.env.SELF_URL


function ResultsPage() {
  const location = useLocation();
  const { result, model, fileName } = location.state || {};

  const [gaugeAngle, setGaugeAngle] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState<"heatmap" | "mask">("heatmap");
  const [historyArray, setHistoryArray] = useState<HistoryRecord[] | null>(null);
  const [historyVisibility, setHistoryVisibility] = useState<boolean>(false);
  const [modelViewAccess, setModelViewAccess] = useState<boolean>(false);

  const limitName = (str: string, max: number) =>
  str.length > max ? str.slice(0, max) + "..." : str;

  useEffect(() => {
      getAccessInfo()
    }, [])
  
      const getAccessInfo = async () => {
        const storedEmail = localStorage.getItem("email");
    
        if (storedEmail === null) {
          return;
        }
        const token = localStorage.getItem("accessToken");
  
        try {
          const response = await fetch (apiUrl + "user/tierInfo", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          if (response.ok){
                  const data = await response.json();
                  if (data.tier){
                    setModelViewAccess(data.tier)
                  }
                } else {
                    toast.error("Something went wrong");
                    return;
                };
        } catch (error) {
          toast.error("" + error)
        }
      }


  useEffect(() => {
    if (result) {
      let start = 0;
      const end = result.confidence * 360;
      const duration = 800; // total animation time (ms)
      const step = 10;
      const increment = end / (duration / step);
    
      const interval = setInterval(() => {
        start += increment;
        if (start >= end) {
          setGaugeAngle(end);
          clearInterval(interval);
        } else {
          setGaugeAngle(start);
        }
      }, step);
    
      return () => clearInterval(interval);
    }
  }, [result]);

  useEffect(() => {
    historyGlorp();
    }, []
  )


  if (!result) {
    return (
      <div className="features-container">
        <div className="main-card">
        <h2>No result data found.</h2>
        <p>
          Please analyze an image first.
        </p>
        <Link to="/home">
          <div className="d-grid">
            <button
              type="button"
              className="button-82-pushable ScanCustomBtn"
            >
              <span className="button-82-shadow"></span>
              <span className="button-82-edge"></span>
              <span className="button-82-front text">Go Scan an Image</span>
            </button>            
          </div>
        </Link>
      </div>
      </div>
    );
  };

  const confidencePercent = (result.confidence * 100).toFixed(1);

  const historyGlorp = async () => {
    const token = localStorage.getItem("accessToken");
    const userEmail = localStorage.getItem("email");
    if (userEmail === null) {
      setHistoryVisibility(false);
    } else {
      try {
            const response = await fetch(apiUrl + "user/get_history", {
              method: "GET",
              credentials: "include",  // optional if you don't need cookies
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": selfUrl,
                "Authorization": `Bearer ${token}`
              }
            });
            
            const result2 = await response.json();

            setHistoryArray(result2["history"]);
            const newRecord = {
                filename: fileName,
                image: result.original_image,
                model: model,
                classification: result.predicted_class,
                confidence: result.confidence,
              }
            try {
            
              await fetch(apiUrl + "user/update_history", {
              method: "POST",
              credentials: "include",  // optional if you don't need cookies
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": selfUrl,
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify(
                      newRecord
                    )
            });
            setHistoryVisibility(true)
            } catch (error) {
              toast.error(""+error);
            }
        } catch (error) {
        toast.error(""+error);
      }
    }
  };

  // Select which image to show
  const displayedImage = showOverlay
    ? overlayType === "heatmap"
      ? result.attention_heatmap
      : result.masked_overlay
    : result.original_image;

  return (
    <div className="d-flex justify-content-center py-5 p-reg">
          <div className="card p-4 shadow cardCustom" style={{ width: "80%" }}>
            {/* Model info */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
      <div className="text-start">
        <h5 className="text-secondary mb-1">Model Used</h5>
        <h3 className="fw-bold mb-0" style={{ color: "#528af1" }}>{model}</h3>
      </div>
      <div className="text-end">
        <Link to="/home">
          <div className="d-grid">
            <button
              type="button"
              className="btn btng ScanCustomBtn"
            >
              <span className="text">Scan Another Image</span>
            </button>            
          </div>
        </Link>
        
      </div>
    </div>

        {/* Prediction + Confidence */}
        <div className="row align-items-center mb-5">
          <div className="col-md-6 text-center text-md-start mb-4 mb-md-0">
            <div className="d-flex justify-content-center align-items-center">
              <h4 className="text-muted">Our analysis says this image is:</h4>
              <br />
              <h1 className="fw-bold display-5 text-success ms-3">
                {result.predicted_class === 1 ? "Human" : "AI"}
              </h1>
            </div>
          </div>

          <div className="col-md-1 d-none d-md-flex justify-content-center">
            <div className="divider"></div>
          </div>

          <div className="col-md-5 text-center">
            <div className="confidence-gauge">
              <div
                className="gauge-fill"
                style={{
                  background: `conic-gradient(
                    from 180deg,
                    #528af1 0deg ${gaugeAngle}deg,
                    #e9ecef ${gaugeAngle}deg 180deg
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
        
        <hr />
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <h3 className="fw-bold mb-0 sp-medium" style={{ color: "#72a3ff" }}>Model's Attention</h3>
        </div>
        {/* Image + Control Panel */}
        <div className="row align-items-center">
          {/* Left: image */}
          <div className="col-md-8 text-center mb-4 mb-md-0">
            <img
              src={`data:image/png;base64,${displayedImage}`}
              alt="Displayed result"
              className="img-fluid rounded shadow-sm main-result-img"
            />
          </div>

          {/* Right: control panel */}
          <div className="col-md-4 text-center text-md-start">
            {modelViewAccess && (
              <>
                <h5 className="mb-3">Display Options</h5>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="toggleOverlay"
                    checked={showOverlay}
                    onChange={(e) => setShowOverlay(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="toggleOverlay">
                    Show Overlay
                  </label>
                </div>

                <div className="d-grid">
                  <button
                    type="button"
                    className="button-82-pushable ScanCustomBtn"
                    onClick={() =>
                      setOverlayType((prev) => (prev === "heatmap" ? "mask" : "heatmap"))
                    }
                    disabled={!showOverlay}
                  >
                    <span className="button-82-shadow"></span>
                    <span className="button-82-edge"></span>
                    <span className="button-82-front text">Swap to {overlayType === "heatmap" ? "Mask" : "Heatmap"}</span>
                  </button>            
                </div>
                <p className="text-muted mt-3 small">
                  When overlay is off, the original image is displayed.
                </p>
              </>
            )}

            {!modelViewAccess && (
              <div>
                <h5 className="mb-3">Display Options</h5>
                <p className="text-muted mt-3 small">
                  Purchase the upgraded tier to access model view features.
                </p>
              </div>
            )}
            
          </div>
        </div>

        

        {historyVisibility && (
          <div>
            <hr />
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <h3 className="fw-bold mb-0" style={{ color: "#528af1" }}>Analysis History</h3>
            </div>

            <div className="">
              <div className="d-flex justify-content-center align-items-center row row-cols-2 row-cols-md-1">

                    {/* If user has no history */}
                    {(!historyArray || historyArray.length === 0) && (
                      <div className="text-center text-muted py-3">
                        <p>No history available yet.</p>
                      </div>
                    )}

                    {/* Map through history records */}
                    {historyArray &&
                      [...historyArray].reverse().map((record, idx) => (
                        <div className="history-card row flex flex-start p-0" key={idx}>

                          {/* Thumbnail */}
                          <img
                            src={`data:image/png;base64,${record.image}`}
                            alt={`History item ${idx}`}
                            className="history-image p-0 col"
                          />

                          {/* Info */}
                          <div className="d-flex justify-content-center align-items-center col testTemp text-start">
                            <div>
                              <p><b>Filename:</b> {limitName(record.filename, 20)}</p>
                              <p><b>Model Used:</b> {record.model}</p>
                              <p><b>Classification:</b> {record.classification === 1 ? "Human" : "AI"}</p>
                              <p><b>Confidence:</b> {(record.confidence * 100).toFixed(2)}%</p>
                            </div>
                          </div>
                        </div>
                      ))}

              </div>
            </div>
          </div>
        )}

        

      </div>
      {/* Toast container */}
        <ToastContainer position="top-center" autoClose={2500} theme="colored" />
    </div>
  );
}

export default ResultsPage;
