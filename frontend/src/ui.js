// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
} from "reactflow";

import { useStore } from "./store";
import { shallow } from "zustand/shallow";

import { InputNode } from "./nodes/inputNode";
import { LLMNode } from "./nodes/llmNode";
import { OutputNode } from "./nodes/outputNode";
import { TextNode } from "./nodes/textNode";

import { ApiNode } from "./nodes/apiNode";
import { DatabaseNode } from "./nodes/databaseNode";
import { EmailNode } from "./nodes/emailNode";
import { JsonNode } from "./nodes/jsonNode";
import { MathNode } from "./nodes/mathNode";

import "reactflow/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,

  api: ApiNode,
  database: DatabaseNode,
  email: EmailNode,
  json: JsonNode,
  math: MathNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => ({
    id: nodeID,
    nodeType: type,
  });

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const reactFlowBounds =
        reactFlowWrapper.current.getBoundingClientRect();

      const data = event.dataTransfer.getData(
        "application/reactflow"
      );

      if (!data) return;

      const appData = JSON.parse(data);
      const type = appData.nodeType;

      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeID = getNodeID(type);

      addNode({
        id: nodeID,
        type,
        position,
        data: getInitNodeData(nodeID, type),
      });
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <>
      <div
        ref={reactFlowWrapper}
  style={{
    width: "100%",
    height: "70vh",
    background: "white",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 25px rgba(0,0,0,.08)",
}}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType="smoothstep"
          fitView
        >
         <Background
    gap={18}
    color="#cbd5e1"
/>

          <MiniMap
    zoomable
  pannable
  style={{
    background: "#f8fafc",
  }}
/>

          <Controls
    showInteractive={false}
/>
        </ReactFlow>
      </div>
    </>
  );
};