import * as React from "react";
import ReactDOM from "react-dom";
import Quiz from "../src/main";

import sampleData from "./sample-data";

const Demo = () => {
  const _getResults = () => {
    return Promise.resolve([
      {
        title: "The top result!",
        description:
          "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        image: "https://placekitten.com/g/300/300",
      },
    ]);
  };
  return (
    <div>
      <Quiz
        formData={sampleData}
        // introComponent={Intro}
        startLabel={"Get Started"}
        nextLabel={"Next"}
        finishLabel={"Get Results"}
        loadingMessage={"Hold tight..."}
        // button={FormButton}
        getResultsFn={_getResults}
        // resultsComponent={ResultsComponent}
        height={`calc(100vh - 46px)`} // 100vh - header height
        theme={{
          section: {
            color: "#fff",
          },
          color: {
            background: "tomato",
            foreground: "#fff",
          },
          container: {
            background: "tomato",
            foreground: "#fff",
          },
        }}
      />
    </div>
  );
};

const root = document.querySelector("#root");

ReactDOM.render(<Demo />, root, () => console.log("App rendered"));
