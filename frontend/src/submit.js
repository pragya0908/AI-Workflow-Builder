// submit.js
// Part 4: Sends pipeline to backend, displays alert with results

import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { useState } from 'react';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      alert('⚠️  Your pipeline is empty. Add some nodes before submitting!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      const { num_nodes, num_edges, is_dag } = result;

      // User-friendly alert message
      const dagStatus = is_dag
        ? '✅  Yes — this pipeline is a valid DAG (no cycles).'
        : '❌  No — this pipeline contains a cycle and is NOT a DAG.';

      alert(
        `📊  Pipeline Analysis\n` +
        `──────────────────────\n` +
        `Nodes  : ${num_nodes}\n` +
        `Edges  : ${num_edges}\n` +
        `Is DAG : ${dagStatus}`
      );
    } catch (err) {
      alert(`🚨  Failed to analyse pipeline:\n${err.message}\n\nMake sure the backend is running on http://127.0.0.1:8000`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 0',
      }}
    >
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          background: loading ? '#45475a' : '#6366f1',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 32px',
          fontSize: 15,
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          letterSpacing: 0.5,
          transition: 'background 0.2s ease',
          boxShadow: loading ? 'none' : '0 2px 8px rgba(99,102,241,0.4)',
        }}
        onMouseOver={(e) => {
          if (!loading) e.target.style.background = '#4f46e5';
        }}
        onMouseOut={(e) => {
          if (!loading) e.target.style.background = '#6366f1';
        }}
      >
        {loading ? '⏳ Analysing…' : '🚀  Submit Pipeline'}
      </button>
    </div>
  );
};