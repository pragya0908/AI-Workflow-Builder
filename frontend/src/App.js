import { PipelineToolbar } from "./toolbar";
import { PipelineUI } from "./ui";
import { SubmitButton } from "./submit";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "30px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#1e293b",
          marginBottom: "25px",
        }}
      >
        VectorShift Pipeline Builder
      </h1>

      <PipelineToolbar />

      <PipelineUI />

      <SubmitButton />
    </div>
  );
}

export default App;