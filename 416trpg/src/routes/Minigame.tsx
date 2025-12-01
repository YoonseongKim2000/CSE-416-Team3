import { useEffect, useState } from 'react';
import './easterEgg.css';
import scannieana from '../assets/scannie-anime.png';
import scannieara from '../assets/unnamed.png';
import scanniega from '../assets/scannie-general.png';
import grey from '../assets/grayyie.png'

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
    const [previewImage, setPreviewImage] = useState<string | null>(grey);

    const [result, setResult] = useState<ResultResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"select" | "play" | "result">("select");

    // ------------------------------
    // Carousel for result screen
    // ------------------------------
    const [carouselIndex, setCarouselIndex] = useState(0);

    useEffect(() => {
        if (mode !== "result") return;

        const interval = setInterval(() => {
            setCarouselIndex(prev => (prev + 1) % 3);
        }, 5000);

        return () => clearInterval(interval);
    }, [mode]);

    const nextImage = () => {
        setCarouselIndex(prev => (prev + 1) % 3);
    };
    
    const prevImage = () => {
        setCarouselIndex(prev => (prev - 1 + 3) % 3);
    };



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
        <div className="egg-container navbar-margin p-reg">

            <div className="egg-card">   {/* NEW: main card wrapper */}

                {/* Always visible */}
                <div className="egg-score">
                    <p className='p-reg'>Total Rounds: {totalRounds}</p>
                    <p className='p-reg'>Your Wins: {humanWins}</p>
                    <p className='p-reg'>AI Wins: {aiWins}</p>
                </div>
                <hr className='blackHR' />

                {/* -------------------- SELECT MODEL SCREEN -------------------- */}
                {mode === "select" && (
                    <div className="egg-select-layout mt-4">
                    
                        {/* TITLE full row */}
                        <div className="egg-select-title">
                            <h1 className='aw-regular'>Choose an AI to Play Against</h1>
                        </div>
                                
                        {/* LEFT SIDE: BUTTONS */}
                        <div className="egg-select-left">
                            <button
                                className="egg-btn p-med"
                                onClick={() => startRound("anime")}
                                onMouseEnter={() => setPreviewImage(scannieana)}
                                onMouseLeave={() => setPreviewImage(scannieana)}
                            >
                                Anime Model
                            </button>
                                
                            <button
                                className="egg-btn p-med"
                                onClick={() => startRound("art")}
                                onMouseEnter={() => setPreviewImage(scannieara)}
                                onMouseLeave={() => setPreviewImage(scannieana)}
                            >
                                Art Model
                            </button>
                                
                            <button
                                className="egg-btn p-med"
                                onClick={() => startRound("general")}
                                onMouseEnter={() => setPreviewImage(scanniega)}
                                onMouseLeave={() => setPreviewImage(scannieana)}
                            >
                                General Model
                            </button>
                        </div>
                                
                        {/* RIGHT SIDE: PREVIEW IMAGE */}
                        <div className="egg-select-preview">
                            <img
                                src={
                                    previewImage
                                        ? previewImage
                                        : `/CSE-416-Team3/default.png`   // DEFAULT PREVIEW
                                }
                                className="egg-select-img"
                            />
                        </div>
                            
                    </div>
                )}



                {/* -------------------- PLAY SCREEN ---------------------------- */}
                {mode === "play" && (
                    <div className="egg-play-layout mt-5">

                        {/* LEFT SIDE — controls */}
                        <div className="egg-play-left">
                            <h2 className='p-med'>Guess the Image!</h2>

                            <button className="egg-btn ai-btn p-med" onClick={() => sendGuess(0)}>AI</button>
                            <button className="egg-btn human-btn p-med" onClick={() => sendGuess(1)}>Human</button>

                            {loading && (
                                <p className="egg-guessing">The AI is guessing...</p>
                            )}
                        </div>

                        {/* VERTICAL LINE */}
                        <div className="egg-divider"></div>

                        {/* RIGHT SIDE — image */}
                        <div className="egg-play-right">
                            <img src={apiUrl + imageUrl} className="egg-main-image" />
                        </div>
                    </div>
                )}

                {/* -------------------- RESULT SCREEN -------------------------- */}
                {mode === "result" && result && (
                    <div className="egg-result-layout mt-5">

                        {/* LEFT SIDE — RESULT TEXT */}
                        <div className="egg-result-left">
                            <h2 className='p-med'>Round Results</h2>
                            <p className='p-reg'>True Answer: {result.truth === 1 ? "Human" : "AI"}</p>
                            <p className='p-reg'>Your Guess: {result.humanCorrect ? "Correct!" : "Wrong!"}</p>
                            <p className='p-reg'>AI Guess: {result.aiCorrect ? "Correct!" : "Wrong!"}</p>
                            <p className='p-reg'>AI Confidence: {(result.confidence * 100).toFixed(1)}%</p>

                            <button className="egg-btn again-btn p-med" onClick={playAgain}>Play Again</button>
                            <button className="egg-btn menu-btn p-med" onClick={() => setMode("select")}>
                                Back to Model Select
                            </button>
                        </div>

                        {/* RIGHT SIDE — image carousel */}
                        <div className="egg-result-right">

                            {/* Image Viewer */}
                            <div className="egg-carousel-wrapper">

                                <button className="egg-carousel-arrow left" onClick={prevImage}>
                                    ‹
                                </button>

                                <img
                                    className="egg-carousel-img"
                                    src={`data:image/png;base64,${
                                        [
                                            result.original_image,
                                            result.attention_heatmap,
                                            result.masked_overlay
                                        ][carouselIndex]
                                    }`}
                                />

                                <button className="egg-carousel-arrow right" onClick={nextImage}>
                                    ›
                                </button>
                                
                            </div>
                                
                            {/* Dots */}
                            <div className="egg-carousel-dots">
                                {[0,1,2].map(i => (
                                    <span
                                        key={i}
                                        className={carouselIndex === i ? "active" : ""}
                                        onClick={() => setCarouselIndex(i)}
                                    />
                                ))}
                            </div>
                            
                        </div>

                    </div>
                )}

            </div>
        </div>
    );

}

export default EasterEggPage;
