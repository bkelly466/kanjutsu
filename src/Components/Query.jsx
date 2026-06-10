// src/components/KanjiLookup.jsx
import React, { useState } from 'react';

export default function KanjiLookup({ onAddCard }) {
  const [query, setQuery] = useState('');
  const [kanjiList, setKanjiList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  ////////////////////////////
  //Extract Kanji Characters//
  ////////////////////////////
  const extractKanji = (text) => {
    const kanjiRegex = /[\u4e00-\u9faf\u3400-\u4dbf]/g;
    return text.match(kanjiRegex) || [];
  };

  ////////////////////////////
  //////Pull Kanji Data///////
  ////////////////////////////
  const searchKanji = async (e) => {
    // Prevent form submission and page reload
    e.preventDefault();
    const kanjiToSearch = [...new Set(extractKanji(query))];
    
    if (kanjiToSearch.length === 0) {
      setError('Please enter at least one valid Kanji character.');
      setKanjiList([]);
      return;
    }
    // Reset state before new search
    setLoading(true);
    setError('');
    setKanjiList([]);

    // Fetch data for each unique Kanji character
    try {
      const fetchPromises = kanjiToSearch.map(async (char) => {
        const response = await fetch(`https://kanjiapi.dev/v1/kanji/${encodeURIComponent(char)}`);
        if (!response.ok) return null;
        return response.json();
      });

      const results = await Promise.all(fetchPromises);
      
      // Filter out any null responses (failed fetches)
      const validResults = results.filter(data => data !== null);

      if (validResults.length === 0) {
        throw new Error('No valid Kanji data found.');
      }

      setKanjiList(validResults);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5 text-dark">
      {/* Centered Search Section */}
      <div className="d-flex flex-column align-items-center text-center mb-4">
        <form onSubmit={searchKanji} className="w-100 d-flex gap-2" style={{ maxWidth: '500px' }}>
          <input
            type="text" 
            className="form-control form-control-lg fs-6"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter word or text (e.g., 漫画, 日本語)"
          />
          <button 
            type="submit" 
            className="btn btn-dark px-4"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger mx-auto text-center mb-4" style={{ maxWidth: '500px' }}>
          {error}
        </div>
      )}

      {/* Grid Layout for Cards (Side by side and auto-wrapping) */}
      {kanjiList.length > 0 && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 justify-content-center">
          {kanjiList.map((kanjiData) => (
            <div className="col" key={kanjiData.kanji}>
              <div className="card h-100 shadow-sm border-light p-3 d-flex flex-column">
                
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                  <span className="display-3 fw-bold text-dark lh-1">
                    {kanjiData.kanji}
                  </span>
                  <div className="text-end text-muted small lh-sm">
                    <div><strong>Strokes:</strong> {kanjiData.stroke_count}</div>
                    {kanjiData.jlpt && <div><strong>JLPT:</strong> N{kanjiData.jlpt}</div>}
                    {kanjiData.grade && <div><strong>Grade:</strong> {kanjiData.grade}</div>}
                  </div>
                </div>

                {/* Details Section */}
                <div className="d-flex flex-column gap-2 flex-grow-1">
                  <div>
                    <span className="d-block text-uppercase text-muted fw-bold" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                      English Meanings
                    </span>
                    <span className="fs-6 text-dark fw-medium">
                      {kanjiData.meanings.join(', ')}
                    </span>
                  </div>

                  <div>
                    <span className="d-block text-uppercase text-muted fw-bold" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                      Onyomi (Chinese Reading)
                    </span>
                    <span className="fs-6 text-danger" style={{ letterSpacing: '0.5px' }}>
                      {kanjiData.on_readings.length > 0 ? kanjiData.on_readings.join('、 ') : 'None'}
                    </span>
                  </div>

                  <div>
                    <span className="d-block text-uppercase text-muted fw-bold" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                      Kunyomi (Japanese Reading)
                    </span>
                    <span className="fs-6 text-primary" style={{ letterSpacing: '0.5px' }}>
                      {kanjiData.kun_readings.length > 0 ? kanjiData.kun_readings.join('、 ') : 'None'}
                    </span>
                  </div>

                  {kanjiData.name_readings.length > 0 && (
                    <div>
                      <span className="d-block text-uppercase text-muted fw-bold" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                        Nanori (Name Readings)
                      </span>
                      <span className="fs-6 text-secondary">
                        {kanjiData.name_readings.join('、 ')}
                      </span>
                    </div>
                  )}
                  <div className="mt-auto pt-3">
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => onAddCard && onAddCard(kanjiData)}
                    >
                      Add to Flashcards
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}