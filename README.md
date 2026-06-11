**KanJutsu**

KanJutsu is a comprehensive, web-based Kanji study aid that combines a powerful Japanese dictionary with a custom Spaced Repetition System (SRS) flashcard deck.

🌱 About this Project:
This application was built as a dedicated learning project to practice and solidify full-stack development skills—specifically building with React, managing state, routing API requests, and implementing custom logic algorithms. It bridges the gap between software engineering and language learning, providing a practical, real-world tool for studying Japanese.

✨ Key Features
Kanji Lookup: Search for Kanji to retrieve rich data, including JLPT levels, stroke counts, Onyomi/Kunyomi readings, and English meanings.

Compound Word Integration: Automatically fetches and displays common compound words associated with searched Kanji to provide real-world context.

Spaced Repetition System (SRS): Features a built-in flashcard deck that utilizes a custom implementation of the SM-2 spaced repetition algorithm. It dynamically calculates your next review date based on how easily you recall the answer (Again, Hard, Good).

Live Study Metrics: Tracks your study sessions in real-time, displaying total cards, cards due today, and accuracy percentages.

Local Storage Persistence: Securely saves your custom flashcard deck and SRS progress directly to your browser's local storage so you never lose your progress.

Custom API Proxy: Utilizes a Node/Express backend function to seamlessly interface with the Jisho API alongside kanjiapi.dev.

Deployed at: https://kanjutsu.vercel.app/

🛠️ Built With
Frontend: React, Vite

Styling: CSS, Bootstrap

Backend / APIs: Serverless API functions, Jisho.org API, KanjiAPI.dev

Deployment Setup: Configured for Vercel

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
npm

Bash
npm install npm@latest -g
Installation
Clone the repository:

Bash
git clone https://github.com/bkelly466/kanjutsu.git
Navigate into the project directory:

Bash
cd kanjutsu
Install NPM packages:

Bash
npm install
Start the development server:

Bash
npm run dev
