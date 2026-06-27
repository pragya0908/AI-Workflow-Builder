// draggableNode.js

export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };

    event.target.style.cursor = "grabbing";

    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData)
    );

    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = "grab")}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
      style={{
        width: "140px",
        height: "70px",
        borderRadius: "12px",
        background: "white",
        border: "2px solid #2563eb",
        cursor: "grab",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        fontWeight: "600",
        color: "#1e293b",

        boxShadow: "0 6px 18px rgba(37,99,235,.12)",

        transition: "all .2s ease",

        userSelect: "none",
      }}
    >
      {label}
    </div>
  );
};