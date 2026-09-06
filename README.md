# Puzzle Solver

A browser-based puzzle game built with HTML, CSS, and JavaScript. Players solve progressively harder puzzles, unlock levels, earn stars and XP, and track their progress across a full game loop with achievements, ranks, boss levels, and a daily challenge.

## Features

- 100-level progression system
- Sliding tile puzzles and logic-based challenges
- Boss levels at milestones 25, 50, 75, and 100
- XP and rank progression
- Star-based scoring and rewards
- Daily challenge mode
- Achievement tracking
- Persistent local progress using browser storage
- Responsive layout for desktop and mobile

## Project Structure

- `index.html` – main page structure
- `style.css` – game styling and responsive UI
- `script.js` – game logic, levels, progression, puzzles, and storage

## How to Run

Because this is a static web project, you can run it in either of these ways:

### Option 1: Open directly in the browser

1. Open the project folder.
2. Double-click `index.html`.
3. The game should load in your default browser.

### Option 2: Use a local web server

From the project folder, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## How to Play

- Click the Start Game button from the home screen.
- Select a level from the map.
- Complete the puzzle to earn stars and XP.
- Unlock higher levels as you progress.
- Visit the statistics and achievements sections to track your performance.

## Notes

- Progress is saved in the browser using `localStorage`.
- The game works best in a modern browser such as Chrome, Edge, or Firefox.

## License

This project is provided for learning and personal use.
