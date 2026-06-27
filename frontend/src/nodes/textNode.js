// textNode.js
// Part 3: Dynamic resize + variable handle detection

import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';

// Regex to extract valid JS variable names from {{ varName }} syntax
const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

function extractVariables(text) {
  const vars = [];
  const seen = new Set();
  let match;
  // Reset lastIndex before each use
  VARIABLE_REGEX.lastIndex = 0;
  while ((match = VARIABLE_REGEX.exec(text)) !== null) {
    const varName = match[1];
    if (!seen.has(varName)) {
      seen.add(varName);
      vars.push(varName);
    }
  }
  return vars;
}

// Minimum and maximum node dimensions
const MIN_WIDTH = 200;
const MIN_HEIGHT = 80;
const MAX_WIDTH = 600;
const PADDING = 40; // extra space around textarea

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const [nodeSize, setNodeSize] = useState({ width: MIN_WIDTH, height: MIN_HEIGHT });

  const textareaRef = useRef(null);
  // Hidden div used to measure the natural size of the text content
  const mirrorRef = useRef(null);

  // Recalculate variables and node size whenever text changes
  useEffect(() => {
    // 1. Extract {{ variable }} handles
    setVariables(extractVariables(currText));

    // 2. Measure content size using a hidden mirror div
    if (mirrorRef.current) {
      const mirror = mirrorRef.current;
      mirror.innerText = currText || ' '; // at least one char so height is non-zero
      const contentWidth = Math.min(mirror.scrollWidth + PADDING, MAX_WIDTH);
      const contentHeight = mirror.scrollHeight + PADDING + 40; // +40 for header

      setNodeSize({
        width: Math.max(MIN_WIDTH, contentWidth),
        height: Math.max(MIN_HEIGHT, contentHeight),
      });
    }
  }, [currText]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  return (
    <div
      style={{
        width: nodeSize.width,
        minHeight: nodeSize.height,
        border: '1px solid #6366f1',
        borderRadius: 8,
        background: '#1e1e2e',
        color: '#cdd6f4',
        fontFamily: 'sans-serif',
        position: 'relative',
        transition: 'width 0.15s ease, min-height 0.15s ease',
        boxShadow: '0 2px 8px rgba(99,102,241,0.2)',
        overflow: 'visible',
      }}
    >
      {/* Node Header */}
      <div
        style={{
          background: '#6366f1',
          borderRadius: '7px 7px 0 0',
          padding: '6px 12px',
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: 0.5,
          color: '#fff',
        }}
      >
        ✏️ Text
      </div>

      {/* Content Area */}
      <div style={{ padding: '10px 12px 12px' }}>
        <label style={{ fontSize: 12, color: '#a6adc8', display: 'block', marginBottom: 4 }}>
          Text
        </label>
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={handleTextChange}
          rows={3}
          style={{
            width: '100%',
            background: '#181825',
            color: '#cdd6f4',
            border: '1px solid #45475a',
            borderRadius: 5,
            padding: '6px 8px',
            fontSize: 13,
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'monospace',
            lineHeight: 1.5,
            overflowY: 'hidden',
          }}
          placeholder="Type text... use {{varName}} to add inputs"
        />

        {/* Show detected variables as pills */}
        {variables.length > 0 && (
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {variables.map((v) => (
              <span
                key={v}
                style={{
                  background: '#313244',
                  color: '#cba6f7',
                  fontSize: 11,
                  borderRadius: 99,
                  padding: '2px 8px',
                  border: '1px solid #45475a',
                }}
              >
                {`{{${v}}}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Hidden mirror div for size measurement */}
      <div
        ref={mirrorRef}
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontSize: 13,
          fontFamily: 'monospace',
          lineHeight: 1.5,
          padding: '6px 8px',
          maxWidth: MAX_WIDTH - PADDING,
          minWidth: MIN_WIDTH - PADDING,
        }}
      />

      {/* Dynamic INPUT Handles — one per extracted variable, evenly spaced on LEFT */}
      {variables.map((varName, index) => {
        const totalVars = variables.length;
        // Spread handles evenly between 20%–80% of the node height
        const topPercent = totalVars === 1
          ? 50
          : 20 + (index / (totalVars - 1)) * 60;

        return (
          <Handle
            key={varName}
            type="target"
            position={Position.Left}
            id={`${id}-${varName}`}
            style={{
              top: `${topPercent}%`,
              background: '#cba6f7',
              border: '2px solid #1e1e2e',
              width: 10,
              height: 10,
            }}
            title={varName}
          >
            {/* Variable label next to handle */}
            <span
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 10,
                color: '#cba6f7',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                background: '#1e1e2e',
                padding: '1px 4px',
                borderRadius: 3,
              }}
            >
              {varName}
            </span>
          </Handle>
        );
      })}

      {/* OUTPUT handle — always on the RIGHT */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{
          background: '#a6e3a1',
          border: '2px solid #1e1e2e',
          width: 10,
          height: 10,
        }}
      />
    </div>
  );
};