#  Pipeline Builder

A visual drag-and-drop pipeline builder built with React and FastAPI.

---

## Demo

> Drag nodes from the sidebar → connect them with edges → click **Submit Pipeline** to analyse the graph.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, ReactFlow 11, Zustand |
| Backend | Python 3, FastAPI, Pydantic |
| Styling | CSS Variables, Inter font (Google Fonts) |

---

## Project Structure

```
frontend_technical_assessment/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   └── BaseNode.js        # Shared node abstraction (Part 1)
│       ├── nodes/
│       │   ├── inputNode.js
│       │   ├── outputNode.js
│       │   ├── llmNode.js
│       │   ├── textNode.js        # Dynamic resize + variable handles (Part 3)
│       │   ├── apiNode.js
│       │   ├── databaseNode.js
│       │   ├── emailNode.js
│       │   ├── jsonNode.js
│       │   └── mathNode.js
│       ├── App.js                 # Root layout — navbar + sidebar + canvas
│       ├── draggableNode.js       # Sidebar node cards with colour theming
│       ├── toolbar.js             # Left sidebar with search + grouped nodes
│       ├── ui.js                  # ReactFlow canvas
│       ├── submit.js              # Pipeline submit + result modal (Part 4)
│       ├── store.js               # Zustand global state
│       └── index.css              # Design system + CSS variables
└── backend/
    └── main.py                    # FastAPI — parse pipeline + DAG check (Part 4)
```

---

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.9+
- pip

---

### 1. Clone the repo

```bash
git clone https://github.com/pragya0908/pragya0908.git
cd frontend_technical_assessment
```

---

### 2. Run the backend

```bash
cd backend
pip install fastapi uvicorn pydantic
python -m uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`

> **Windows users:** If you get a path error in PowerShell, use `python -m uvicorn main:app --reload` directly without activating a venv, or make sure your venv has the packages installed:
> ```powershell
> pip install fastapi uvicorn pydantic
> ```

---

### 3. Run the frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`

---



### Part 1 — Node Abstraction

All nodes are built on a shared `BaseNode` component (`src/components/BaseNode.js`). It accepts:

| Prop | Type | Description |
|---|---|---|
| `title` | string | Node header label |
| `nodeType` | string | Drives accent colour theme |
| `icon` | string | Emoji/character shown in header |
| `inputs` | array | Left-side Handle definitions |
| `outputs` | array | Right-side Handle definitions |
| `children` | ReactNode | Node body content |

Each node type gets its own accent colour automatically — no extra styling needed per node. Adding a new node takes ~15 lines:

```jsx
export const MyNode = ({ id }) => (
  <BaseNode title="My Node" nodeType="myNode" icon="✦"
    outputs={[{ id: `${id}-out`, position: Position.Right }]}>
    <label className="node-label">Config</label>
    <input className="node-input" placeholder="value" />
  </BaseNode>
);
```

**9 nodes included:** Input, Output, LLM, Text, API, Database, Email, JSON, Math.

---

### Part 2 — Styling

- **Design system** via CSS custom properties (`--brand`, `--bg-app`, `--border`, etc.)
- **Inter** font via Google Fonts
- Each node type has a unique accent colour (blue, green, purple, orange, teal, red, sky, fuchsia)
- Hover lift effect on every node
- Polished sidebar with grouped nodes and live search
- Custom ReactFlow overrides — rounded controls, styled minimap, animated edges

---

### Part 3 — Text Node Logic

The Text node (`src/nodes/textNode.js`) has two dynamic behaviours:

**Auto-resize:** A hidden mirror `<div>` measures the natural content size after every keystroke. The node width and height update smoothly via `useEffect` + CSS `transition`.

**Variable handles:** Any `{{variableName}}` pattern where `variableName` is a valid JavaScript identifier automatically creates a labelled input Handle on the left side of the node. Multiple variables are evenly spaced. Handles disappear when the variable is removed from the text.

```
Type: "Hello {{name}}, your score is {{score}}"
→ Creates two input handles: [name] and [score]
```

---

### Part 4 — Backend Integration

**Frontend (`submit.js`):**
- Reads nodes and edges from Zustand store
- POSTs to `POST /pipelines/parse` as JSON
- Shows a polished result modal (not a native `alert()`) with node count, edge count, and DAG status
- Inline error if pipeline is empty or backend is unreachable

**Backend (`main.py`):**
- CORS middleware enabled for `localhost:3000`
- Pydantic models validate the request body
- DAG detection using **Kahn's algorithm** (BFS topological sort)
- Returns `{ num_nodes, num_edges, is_dag }`

```
POST /pipelines/parse
Body: { nodes: [...], edges: [...] }

Response: { "num_nodes": 3, "num_edges": 2, "is_dag": true }
```

---

## API Reference

### `GET /`
Health check.
```json
{ "Ping": "Pong" }
```

### `POST /pipelines/parse`
Analyse a pipeline graph.

**Request body:**
```json
{
  "nodes": [{ "id": "customInput-1" }, { "id": "llm-1" }],
  "edges": [{ "id": "e1", "source": "customInput-1", "target": "llm-1" }]
}
```

**Response:**
```json
{
  "num_nodes": 2,
  "num_edges": 1,
  "is_dag": true
}
```

---

## Key Design Decisions

**Why Kahn's algorithm for DAG detection?**
It handles disconnected graphs gracefully and runs in O(V + E) time. If every node is visited during the BFS traversal, there are no cycles.

**Why replace `alert()` with a modal?**
Native `alert()` blocks the browser thread and looks unpolished. The custom modal keeps the user in the app, supports rich formatting, and can be extended with more pipeline metadata in the future.

**Why a sidebar instead of a top toolbar?**
With 9 node types (and room to add more), a vertical sidebar scales better than a horizontal strip. It also mirrors real pipeline builder UIs like Langflow and n8n.

---

## Author

**Pragya** — B.Sc. (Hons.) Computer Science & Statistics, CHRIST University Bengaluru  
GitHub: [github.com/pragya0908/pragya0908](https://github.com/pragya0908/pragya0908)
