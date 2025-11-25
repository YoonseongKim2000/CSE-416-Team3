import { useEffect, useState } from 'react';
import './easterEgg.css';

const apiUrl = import.meta.env.VITE_API_URL

type ResultResponse = {
    truth: number;
    humanCorrect: boolean;
    aiCorrect: boolean;
    aiPrediction: number;
    confidence: number;
    original_image: string;
    attention_heatmap: string;
    masked_overlay: string;
};

function EasterEggPage() {
    const [model, setModel] = useState<string>("");
    const [roundId, setRoundId] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");

    const [result, setResult] = useState<ResultResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"select" | "play" | "result">("select");

    // ------------------------------
    // Score Tracker (local)
    // ------------------------------
    const [totalRounds, setTotalRounds] = useState(0);
    const [humanWins, setHumanWins] = useState(0);
    const [aiWins, setAiWins] = useState(0);

    // ------------------------------
    // Start a new round
    // ------------------------------
    const startRound = async (m: string) => {
        setModel(m);
        setMode("play");
        setResult(null);

        const res = await fetch(apiUrl+`api/minigame/start?model=${m}`);
        const data = await res.json();

        setRoundId(data.roundId);
        setImageUrl(data.imageUrl);
    };

    // ------------------------------
    // Submit Guess
    // ------------------------------
    const sendGuess = async (guess: number) => {
        if (!roundId) return;

        setLoading(true);

        const form = new FormData();
        form.append("roundId", roundId);
        form.append("guess", String(guess));

        const res = await fetch(apiUrl+`api/minigame/guess`, {
            method: "POST",
            body: form
        });

        const data = await res.json();
        setResult(data);
        setMode("result");
        setLoading(false);

        // --------------------------
        // Update Score Tracker
        // --------------------------
        setTotalRounds(prev => prev + 1);
        if (data.humanCorrect) setHumanWins(prev => prev + 1);
        if (data.aiCorrect) setAiWins(prev => prev + 1);
    };

    // ------------------------------
    // Start Another Round (same model)
    // ------------------------------
    const playAgain = async () => {
        startRound(model);
    };

    return (
        <div className="egg-container">
            {/* -------------------- Score Tracker -------------------- */}
            {mode !== "select" && (
                <div className="egg-score navbar-margin">
                    <p>Total Rounds: {totalRounds}</p>
                    <p>Your Wins: {humanWins}</p>
                    <p>AI Wins: {aiWins}</p>
                </div>
            )}

            {/* -------------------------------------------------- */}
            {/* SELECT MODEL SCREEN */}
            {/* -------------------------------------------------- */}
            {mode === "select" && (
                <div className="navbar-margin egg-select">
                    <h1 className='navbar-margin'>Choose an AI to Play Against</h1>
                    <button className="egg-btn" onClick={() => startRound("anime")}>Anime Model</button>
                    <button className="egg-btn" onClick={() => startRound("art")}>Art Model</button>
                    <button className="egg-btn" onClick={() => startRound("general")}>General Model</button>
                </div>
            )}

            {/* -------------------------------------------------- */}
            {/* PLAY SCREEN */}
            {/* -------------------------------------------------- */}
            {mode === "play" && (
                <div className="egg-play">
                    <h2 className='navbar-margin'>Guess the Image!</h2>

                    <img src={apiUrl+imageUrl} className="egg-main-image" />

                    <div className="egg-buttons">
                        <button className="egg-btn ai-btn" onClick={() => sendGuess(0)}>AI</button>
                        <button className="egg-btn human-btn" onClick={() => sendGuess(1)}>Human</button>
                    </div>

                    {loading && <p className="egg-loading">Checking...</p>}
                </div>
            )}

            {/* -------------------------------------------------- */}
            {/* RESULT SCREEN */}
            {/* -------------------------------------------------- */}
            {mode === "result" && result && (
                <div className="egg-result">
                    <h2>Round Results</h2>

                    <p>Your Guess: {result.humanCorrect ? "Correct!" : "Wrong!"}</p>
                    <p>AI Guess: {result.aiCorrect ? "Correct!" : "Wrong!"}</p>
                    <p>AI Confidence: {(result.confidence * 100).toFixed(1)}%</p>

                    <div className="egg-img-row">
                        <div>
                            <p>Original</p>
                                <img src={`data:image/png;base64,${result.original_image}`} className="egg-small-img" />
                        </div>
                        <div>
                            <p>Heatmap</p>
                            <img src={`data:image/png;base64,${result.attention_heatmap}`} className="egg-small-img" />
                        </div>
                        <div>
                            <p>Masked Overlay</p>
                            <img src={`data:image/png;base64,${result.masked_overlay}`} className="egg-small-img" />
                        </div>
                    </div>

                    <button className="egg-btn again-btn" onClick={playAgain}>Play Again</button>
                    <button className="egg-btn menu-btn" onClick={() => setMode("select")}>
                        Back to Model Select
                    </button>
                </div>
            )}
        </div>
    );
}

export default EasterEggPage;
