import React from "react";

export default {
  introComponent: ({ children }) => (
    <div>
      <h1>
        Want to do the questionnaire? Click the button below to get started
      </h1>
      {children}
    </div>
  ),
  getResultsFn: () => {
    console.error("getResultsFn property is required.");
  },
  resultsComponent: ({ results = [] }) => {
    const initialResult = results[0] || null;
    if (!initialResult) {
      console.error("You need to pass in results to the component");
      return <div>No results</div>;
    }
    return (
      <div>
        <img src={initialResult.image} />
        <h2>{initialResult.title}</h2>
        <p>{initialResult.body}</p>
      </div>
    );
  },
};
