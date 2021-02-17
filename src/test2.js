import React, { useState } from "react";

function Something({ a, b }) {
  const [first, setFirst] = useState(0);
  return (
    <h1
    onClick={() =>setFirst(first+1)}
    >
      test2: {first + b}
    </h1>
  );
};

export default Something;