import { useEffect, useState } from "react";
import "./ApiDocs.css";

function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Track scroll position to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      let current = "";
      let minDistance = Infinity;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top - window.innerHeight * 0.3);
        if (distance < minDistance) {
          minDistance = distance;
          current = section.id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll when clicking sidebar items
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="api-docs-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-content">
          <h4 className="sidebar-title">Quick Access</h4>
          <ul className="sidebar-list">
            {["Overview", "Base URL", "Authentication", "Endpoint: Analyze Image", "Successful Response (Example)"].map((id) => (
              <li
                key={id}
                className={`sidebar-item ${activeSection === id ? "active" : ""}`}
                onClick={() => scrollToSection(id)}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </li>
            ))}
          </ul>
        </div>
        <div className="sidebar-fade"></div>
      </aside>

      {/* Toggle Button */}
      <button
        className={`sidebar-toggle-fixed ${sidebarOpen ? "open" : "closed"}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "‹" : "›"}
      </button>

      {/* Main content */}
      <main className={`docs-content ${sidebarOpen ? "shifted" : "centered"}`}>
        <div className="card p-4 shadow api-docs-card">
          <section id="Overview" className="text-start">
            <h2>Overview</h2>
            <p>
              The TrueVision API allows developers to analyze images using our advanced machine-learning models. 
              The implementation of our API will allow clients to upload an image and specify the model to receive 
              prediction results through a simple, secure, token-based REST API.
            </p>

            <p>
              External access requires a valid API Key and sufficient tokens. Each API call will consume 1 token.

            </p>
            </section>

          <section id="Base URL" className="text-start">
            <h2>Base URL</h2>
            <p>
              <pre>
                <code className="codeVals">
                  https://220.126.157.140:10000/api/APIanalyze
                </code>
              </pre>
            </p>
            </section>

          <section id="Authentication" className="text-start">
            <h2>API Endpoints</h2>
            <h3>API Key</h3>
            <p>
              Every user is assigned a unique API Key. The use of the TrueVision API requires 
              your API. Therefore, include it in your request as a form field:
            </p>

            <pre>
                <code className="codeVals">
                  apiKey=YOUR_API_KEY
                </code>
            </pre>

            <h3>Token System</h3>
            <ul>
              <li>Each request to /APIanalyze costs 1 token.</li>
              <li>Insufficient tokens on your account will reject the request.</li>
            </ul>

            <h3>Invalid or Missing Keys</h3>
            <table>
              <tr>
                <th><b>Status</b></th>
                <th><b>Error</b></th>
                <th><b>Description</b></th>
              </tr>

              <tr>
                <td className="text-center">400</td>
                <td>“API Key Missing”</td>
                <td>No API key was provided</td>
              </tr>

              <tr>
                <td className="text-center">401</td>
                <td>“Invalid API Key”</td>
                <td>Key does not exist in the database</td>
              </tr>

              <tr>
                <td className="text-center">402</td>
                <td>“Insufficient Tokens”</td>
                <td>Requestor has 0 tokens remaining</td>
              </tr>
            </table>
          </section>

          <section id="Endpoint: Analyze Image" className="text-start">
            <h2>Endpoint: Analyze Image</h2>
            <h3>POST (/APIanalyze)</h3>
            <p>Analyze an image using one of the available TrueVision AI models.</p>

            <h3>Request Format</h3>
            <p>The request must be sent as a multipart/form-data.</p>

            <table>
              <tr>
                <th><b>Field</b></th>
                <th><b>Type</b></th>
                <th><b>Required</b></th>
                <th><b>Description</b></th>
              </tr>

              <tr>
                <td>model</td>
                <td>string</td>
                <td>Yes</td>
                <td>Model to use (“general”, “art”, “anime”)</td>
              </tr>

              <tr>
                <td>image</td>
                <td>file</td>
                <td>Yes</td>
                <td>Image to analyze (png, jpg, etc)</td>
              </tr>

              <tr>
                <td>apiKey</td>
                <td>string</td>
                <td>Yes</td>
                <td>Your API key</td>
              </tr>
            </table>
            <br />
            <h3>Example Requests</h3>
            <h4>cURL</h4>
            <pre>
              <code>curl -X POST "https://220.126.157.140:10000/api/APIanalyze" \</code><br />
                <code>-F "model=general" \</code><br />
                <code>-F "image=@./input.jpg" \</code><br />
                <code>-F "apiKey=YOUR_API_KEY"</code><br />
            </pre>
            <h4>JavaScript (fetch)</h4>
            <pre>
              <code>const formData = new FormData();</code><br />
              <code>formData.append("model", "general");</code><br />
              <code>formData.append("image", file);</code><br />
              <code>formData.append("apiKey", "YOUR_API_KEY");</code><br />
              <br />
              <code>const response = await fetch &#40;"https://220.126.157.140:10000/api/APIanalyze", &#123;</code><br />
              <code>&#9;method: "POST",</code><br />
              <code>&#9;body: formData,</code><br />
              <code>&#125;&#41;;</code><br />
              <br />
              <code>const result = await response.json();</code><br />
              <code>console.log(result);</code><br />
            </pre>
            <h4>Python (requests)</h4>
            <pre>
              <code>import requests</code><br />
              <br />
              <code>files = &#123;"image" &#58; open("input.jpg", "rb")&#125;</code><br />
              <code>data = &#123;"model"&#58; "general", "apiKey"&#58; "YOUR_API_KEY"&#125;</code><br />
              <br />
              <code>response = requests.post("https://api.truevision.com/api/APIanalyze", data=data, files=files)</code><br />
              <code>print(response.json())</code><br />s
            </pre>
          </section>

          <section id="Successful Response (Example)" className="text-start">
            <h2>Successful Response (Example)</h2>
            <pre>
              <code>&#123;</code><br />
              <code>&#9;"predicted_class": int,</code><br />
              <code>&#9;"confidence": float,</code><br />
              <code>&#9;"original_image": base64_string,</code><br />
              <code>&#9;"attention_heatmap": base64_string,</code><br />
              <code>&#9;"masked_overlay": base64_string</code><br />
              <code>&#123;</code><br />
            </pre>
            <h3>Response Structure</h3>
            <table>
              <tr>
                <th><b>Field</b></th>
                <th><b>Description</b></th>
              </tr>

              <tr>
                <td>predicted_class</td>
                <td>The primary result from TrueVision’s models. 0 is AI and 1 is Human.</td>
              </tr>

              <tr>
                <td>confidence</td>
                <td>Probability score from 0–1</td>
              </tr>

              <tr>
                <td>Original_image / attention_heatmap / masked_overlay</td>
                <td>Returns the original image and attention as a base 64 string</td>
              </tr>
              </table>
            </section>
        </div>
      </main>
    </div>
  );
}

export default ApiDocsPage;
