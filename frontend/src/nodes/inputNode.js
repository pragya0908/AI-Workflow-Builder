import { useState } from "react";
import { Position } from "reactflow";
import BaseNode from "../components/BaseNode";

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_")
  );
  const [inputType, setInputType] = useState(data?.inputType || "Text");

  const handleNameChange = (e) => setCurrName(e.target.value);
  const handleTypeChange = (e) => setInputType(e.target.value);

  return (
    <BaseNode
      title="Input"
      outputs={[{ id: `${id}-value`, position: Position.Right }]}
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
          value={inputType}
          onChange={handleTypeChange}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
          }}
        >
          <option>Text</option>
          <option>File</option>
        </select>
      </label>
    </BaseNode>
  );
};