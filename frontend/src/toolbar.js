import { DraggableNode } from "./draggableNode";

export const PipelineToolbar = () => {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "15px",
        marginBottom: "25px",
        boxShadow: "0 5px 20px rgba(0,0,0,.08)",
      }}
    >
      <h3
        style={{
          marginBottom: "20px",
          color: "#334155",
        }}
      >
        Drag Components
      </h3>

      <div
        style={{
          display: "flex",
          gap: "18px",
          flexWrap: "wrap",
        }}
      >
        <DraggableNode type="customInput" label="Input" />
        <DraggableNode type="llm" label="LLM" />
        <DraggableNode type="customOutput" label="Output" />
        <DraggableNode type="text" label="Text" />
        <DraggableNode type="api" label="API" />
        <DraggableNode type="database" label="Database" />
        <DraggableNode type="email" label="Email" />
        <DraggableNode type="json" label="JSON" />
        <DraggableNode type="math" label="Math" />
      </div>
    </div>
  );
};