import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const apiUrl = import.meta.env.VITE_API_URL

function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // State for image preview and file
  const [preview, setPreview] = useState<string>(
    "https://bootstrap-cheatsheet.themeselection.com/assets/images/bs-images/img-2x1.png"
  );
  const [file, setFile] = useState<File | null>(null);
  const [model, setModel] = useState<string>("general");
  const [accessStatus, setAccessStatus] = useState<boolean>(true);

  useEffect(() => {
    getAccessInfo()
  })

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
                  setAccessStatus(!data.tier)
                }
              } else {
                  toast.error("Something went wrong");
                  return;
              };
      } catch (error) {
        toast.error("" + error)
      }
    }

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select an image file (PNG, JPG, etc.)");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Handle model selection
  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setModel(event.target.value);
  };

  // Handle scan click
  const handleScan = async () => {
  if (!file) {
    toast.warning("Please upload an image before scanning!");
    return;
  }

  setLoading(true);
  const startTime = Date.now();

  const formData = new FormData();
  formData.append("model", model);
  formData.append("image", file);

  try {
    const response = await fetch(apiUrl + "api/analyze", {
      method: "POST",
      body: formData,
    });

    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(1000 - elapsed, 0); // ensure at least 1s display

    const result = await response.json();

    await new Promise((resolve) => setTimeout(resolve, remainingTime));
    console.log(response)
    if (!response.ok) {
      throw new Error(result?.detail || "Server error");
    }

    toast.success("Image analyzed successfully!");
    navigate("/results", { state: { result, model } });
  } catch (error) {
    console.error(error);
    toast.error(""+(error));
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="homepage container-fluid py-5 d-flex justify-content-center align-items-center">
      {/* Loading overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p className="loading-text mt-3">Analyzing Image...</p>
        </div>
      )}

      {/* Main content (hidden while loading) */}
      {!loading && (
        <div className="text-center w-75">
          <h1 className="mb-4 fw-bold AnalyzeImage aw-regular">Analyze Image</h1>

          <div className="card shadow-lg border-0 p-4">
            {/* Model selection */}
            <div className="form-floating mb-4 modelselect p-reg">
              <select
                className="form-select"
                id="floatingSelect"
                aria-label="Model selection p-reg"
                value={model}
                onChange={handleModelChange}
              >
                <option className="p-reg" value="general">General Model</option>
                <option className="p-reg" value="art" disabled={accessStatus}>Art Model</option>
                <option className="p-reg" value="anime" disabled={accessStatus}>Anime Model</option>
              </select>
              <label htmlFor="floatingSelect" className="p-reg">Select Model</label>
            </div>

            {/* Image preview */}
            <div className="text-center mb-4">
              <img
                src={preview}
                className="img-fluid rounded shadow-sm preview-image"
                alt="Preview"
              />
            </div>

            {/* File upload */}
            <div className="mb-3">
              <input
                className="form-control fileselect"
                type="file"
                id="formFile"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* Scan button */}
            <div className="d-grid">
              <button
                type="button"
                className="button-82-pushable ScanCustomBtn"
                onClick={handleScan}
              >
                <span className="button-82-shadow"></span>
                <span className="button-82-edge"></span>
                <span className="button-82-front text">Scan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast container */}
      <ToastContainer position="top-center" autoClose={2500} theme="colored" />
    </div>
  );
}

export default HomePage;
