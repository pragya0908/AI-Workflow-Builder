import { useState } from "react";
import { Position } from "reactflow";
import BaseNode from "../components/BaseNode";

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.outputName || id.replace("customOutput-", "output_")
  );
  const [outputType, setOutputType] = useState(data?.outputType || "Text");

  const handleNameChange = (e) => setCurrName(e.target.value);
  const handleTypeChange = (e) => setOutputType(e.target.value);

  return (
    <BaseNode
      title="Output"
      inputs={[{ id: `${id}-value`, position: Position.Left }]}
    >
      <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
        Name
        <input
          type="text"
          value={currName}
          placeholder="Enter name"
          onChange={handleNameChange}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
          }}
        />
      </label>

      <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
        Type
        <select
          value={outputType}
          onChange={handleTypeChange}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
          }}
        >
          <option>Text</option>
          <option>Image</option>
        </select>
      </label>
    </BaseNode>
  );
};