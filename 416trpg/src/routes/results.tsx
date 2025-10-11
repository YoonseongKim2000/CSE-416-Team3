import { useLocation } from "react-router-dom";

function ResultsPage() {
  const location = useLocation();
  const { result, model } = location.state || {};

  if (!result) {
    return (
        <div className="container py-5 text-center">
            <h1>No result data found. Please analyze an image first.</h1>
        </div>
        
    );
  }

  return (
    <div className="container py-5 text-center">
      <h1 className="mb-4 text-primary">Analysis Results</h1>
      <p><strong>Model Used:</strong> {model}</p>

      <pre className="text-start bg-light p-3 rounded shadow-sm">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}

export default ResultsPage;
