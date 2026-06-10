import { useState, useEffect } from 'react'
import './App.css'
import Query from './Components/Query';
import StudySession from './Components/StudySession';
import { getReviewStats } from './utils/srsAlgorithm';

const LOCAL_STORAGE_KEY = 'srs_flashcard_deck';

function App() {
  const [isStudyTime, setIsStudyTime] = useState(false);
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedCards ? JSON.parse(savedCards) : [];
  });
  
  const [activeTab, setActiveTab] = useState('review');

  ////////////////////////////////////
  //////Save Flashcards Locally///////
  ////////////////////////////////////
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);


  ////////////////////////////////////
  //////////Add Flashcard/////////////
  ////////////////////////////////////
  const handleAddCard = (kanjiData) => {
    const newCard = {
      id: crypto.randomUUID(),
      front: kanjiData.kanji,
      back: {
        meanings: kanjiData.meanings.join(', '),
        onyomi: kanjiData.on_readings.join(', '),
        kunyomi: kanjiData.kun_readings.join(', ')
      },
      repetitions: 0,
      easeFactor: 2.5,
      interval: 0,
      nextReviewDate: new Date().toISOString() 
    };
    setCards(prevCards => [...prevCards, newCard]);
  }

  ////////////////////////////////////
  //////////Update SRS Metrics////////
  ////////////////////////////////////
  const handleUpdateSRS = (cardId, updatedMetrics) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId 
          ? { ...card, ...updatedMetrics } 
          : card
      )
    );
  };

  return (
    <>
      {/*Conditional rendering based on study mode*/}
      {!isStudyTime ?
      <div className="container my-5 text-dark">
        <div className="d-flex flex-column align-items-center text-center mb-4">
          <h1 className="display-4 fw-bold mb-3">KanKanKanji</h1>
          <p className="lead mb-4">Your comprehensive Kanji study aid</p>
         </div>
        <div className="w-100 mb-4">
          <Query onAddCard={handleAddCard} />
        </div>

        <div className="w-100 mx-auto mb-4" style={{ maxWidth: "500px" }}>
          <button 
            className="btn btn-outline-primary w-100 py-2 fw-semibold"
            onClick={() => setIsStudyTime(true)}
          >
            Go to Study Mode
          </button>
        </div>
      </div> 
      
      : 

      <div className="container my-5 text-dark d-flex flex-column align-items-center">
        <div className="mb-4 text-center">
          <h1 className="display-4 fw-bold">KanKanKanji</h1>
          <p className="lead mb-0">Study Mode</p>
        </div>

        {/* Review Statistics */}
        {cards.length > 0 && (
          <div className="alert alert-info mb-4" role="alert" style={{ maxWidth: "600px", width: "100%" }}>
            <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)', textAlign: 'center' }}>
              <div>
                <div className="h5 mb-0">{getReviewStats(cards).totalCards}</div>
                <small>Total Cards</small>
              </div>
              <div>
                <div className="h5 mb-0">{getReviewStats(cards).dueCards}</div>
                <small>Due Today</small>
              </div>
              <div>
                <div className="h5 mb-0">{getReviewStats(cards).reviewedCards}</div>
                <small>Reviewed</small>
              </div>
              <div>
                <div className="h5 mb-0">{getReviewStats(cards).newCards}</div>
                <small>New</small>
              </div>
            </div>
          </div>
        )}

        {/* Study Session or Empty State */}
        <div style={{ maxWidth: "600px", width: "100%", marginBottom: "2rem" }}>
          {cards.length === 0 ? (
            <div className="alert alert-warning text-center">
              <p className="mb-0">No flashcards yet! Go to Dictionary Mode to add some kanji.</p>
            </div>
          ) : (
            <StudySession 
              cards={cards} 
              onUpdateCard={handleUpdateSRS}
              onExit={() => setIsStudyTime(false)}
            />
          )}
        </div>

        <div className="w-100" style={{ maxWidth: "500px" }}>
          <button 
            className="btn btn-secondary w-100 py-2 fw-semibold"
            onClick={() => setIsStudyTime(false)}
          >
            Back to Dictionary Mode
          </button>
        </div>
      </div>
      }
    </>
  )
}

export default App
