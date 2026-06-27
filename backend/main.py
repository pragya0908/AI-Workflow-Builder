# main.py
# Part 4: Parse pipeline, count nodes/edges, check for DAG

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any

app = FastAPI()

# Allow requests from the React dev server (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Pydantic models ────────────────────────────────────────────────────────────

class Node(BaseModel):
    id: str
    # Accept any extra fields (position, type, data, etc.) without breaking
    model_config = {"extra": "allow"}


class Edge(BaseModel):
    id: str
    source: str
    target: str
    model_config = {"extra": "allow"}


class Pipeline(BaseModel):
    nodes: list[Node]
    edges: list[Edge]


# ── DAG check using Kahn's algorithm (BFS-based topological sort) ──────────────

def is_dag(nodes: list[Node], edges: list[Edge]) -> bool:
    """
    Returns True if the graph formed by nodes+edges is a Directed Acyclic Graph.
    Uses Kahn's algorithm:
      1. Build an adjacency list and in-degree map.
      2. Start with all nodes that have in-degree 0.
      3. Process each such node, reducing the in-degree of its neighbours.
      4. If we process all nodes, there are no cycles → it's a DAG.
    """
    node_ids = {node.id for node in nodes}

    # in-degree counts
    in_degree: dict[str, int] = {nid: 0 for nid in node_ids}
    # adjacency list
    adj: dict[str, list[str]] = {nid: [] for nid in node_ids}

    for edge in edges:
        src, tgt = edge.source, edge.target
        # Guard against edges referencing non-existent nodes
        if src in node_ids and tgt in node_ids:
            adj[src].append(tgt)
            in_degree[tgt] += 1

    # BFS queue: all nodes with no incoming edges
    queue = [nid for nid, deg in in_degree.items() if deg == 0]
    visited = 0

    while queue:
        current = queue.pop(0)
        visited += 1
        for neighbour in adj[current]:
            in_degree[neighbour] -= 1
            if in_degree[neighbour] == 0:
                queue.append(neighbour)

    # If we visited every node, the graph is acyclic
    return visited == len(node_ids)


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag_result = is_dag(pipeline.nodes, pipeline.edges)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": dag_result,
    }