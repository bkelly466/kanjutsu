import { useState, useEffect } from 'react';
import { calculateNextReview, getCardsForReview } from '../utils/srsAlgorithm';

export default function StudySession({ cards, onUpdateCard, onExit }) {
  const [cardsToReview, setCardsToReview] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    const dueCards = getCardsForReview(cards);
    setCardsToReview(dueCards);
    setSessionStats({ correct: 0, total: dueCards.length });
  }, [cards]);

  if (cardsToReview.length === 0) {
    return (
      <div className="text-center p-5">
        <div className="alert alert-info" role="alert">
          <h4 className="alert-heading">No cards to review!</h4>
          <p>You're all caught up. Come back later.</p>
          <hr />
          <p className="mb-0">Total cards in deck: {cards.length}</p>
        </div>
        <button className="btn btn-primary mt-3" onClick={onExit}>
          Back to Main Menu
        </button>
      </div>
    );
  }

  const currentCard = cardsToReview[currentIndex];
  const progress = ((currentIndex + 1) / cardsToReview.length) * 100;

  const handleReview = (quality) => {
    const updatedMetrics = calculateNextReview(currentCard, quality);
    onUpdateCard(currentCard.id, updatedMetrics);

    if (quality >= 3) {
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    }

    // Move to next card or end session
    if (currentIndex < cardsToReview.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Session complete
      setCurrentIndex(-1);
    }
  };

  // Show completion screen
  if (currentIndex === -1) {
    const accuracy = ((sessionStats.correct / sessionStats.total) * 100).toFixed(1);
    return (
      <div className="text-center p-5">
        <div className="alert alert-success" role="alert">
          <h4 className="alert-heading">Study Session Complete!</h4>
          <p>Cards reviewed: {sessionStats.total}</p>
          <p>Correct: {sessionStats.correct}</p>
          <p className="mb-0">Accuracy: {accuracy}%</p>
        </div>
        <button className="btn btn-primary mt-3" onClick={onExit}>
          Back to Main Menu
        </button>
      </div>
    );
  }

  return (
    <div className="study-session" style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Progress bar */}
      <div className="mb-4">
        <div className="progress" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-muted text-center mt-2">
          Card {currentIndex + 1} of {cardsToReview.length}
        </p>
      </div>

      {/* Flashcard */}
      <div
        className="card mb-4 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          perspective: '1000px',
          background: isFlipped ? '#f8f9fa' : '#fff',
          border: '2px solid #dee2e6',
          transition: 'all 0.3s ease'
        }}
      >
        <div className="text-center p-4">
          {!isFlipped ? (
            <div>
              <p className="text-muted small mb-2">Front (click to reveal)</p>
              <h1 className="display-2 mb-0" style={{ fontWeight: 'bold', color: '#1A202C' }}>
                {currentCard.front}
              </h1>
            </div>
          ) : (
            <div>
              <p className="text-muted small mb-3">Back</p>
              <div style={{ textAlign: 'left', fontSize: '14px' }}>
                <div className="mb-2">
                  <strong>Meanings:</strong> {currentCard.back.meanings}
                </div>
                <div className="mb-2">
                  <strong>On'yomi:</strong> {currentCard.back.onyomi}
                </div>
                <div>
                  <strong>Kun'yomi:</strong> {currentCard.back.kunyomi}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review buttons */}
      {isFlipped && (
        <div className="review-buttons d-grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <button
            className="btn btn-danger"
            onClick={() => handleReview(0)}
            title="Complete blackout"
          >
            Again
          </button>
          <button
            className="btn btn-warning"
            onClick={() => handleReview(2)}
            title="Incorrect response"
          >
            Hard
          </button>
          <button
            className="btn btn-success"
            onClick={() => handleReview(4)}
            title="Correct after hesitation"
          >
            Good
          </button>
        </div>
      )}

      <div className="text-center mt-3 text-muted small">
        {sessionStats.correct}/{sessionStats.total} correct so far
      </div>
    </div>
  );
}
