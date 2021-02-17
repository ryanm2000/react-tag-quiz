import React, { useState, useRef } from "react";
import styled from "styled-components";

import defaults from "./defaults";

const Limitation = styled.div`
  font-size: 0.85em;
  color: currentColor;
  opacity: 0.75;
`;

const OptionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 1em 0;
  max-width: 600px;
  width: 100%;
`;

const DisplayOptionWrapper = styled.label`
  margin: 0;
  input {
    display: none;
  }
`;

const DisplayOption = styled.div`
  border-radius: 2em;
  border: solid currentColor 1px;
  color: currentColor;
  cursor: pointer;
  margin: 0.5em 1em;
  padding: 1em 2.5em;

  input:checked + &,
  &:hover {
    background: ${(p) => p.theme.color.foreground};
    border-color: ${(p) => p.theme.color.foreground};
    color: ${(p) => p.theme.color.background};
  }

  @media (max-width: 550px) {
    margin: 0.5em;
  }
`;

const Section = styled.div`
  align-items: center;
  display: ${(p) => (p.isActive ? "flex" : "none")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: ${(p) => p.height};
  overflow: hidden;
  padding: 4em 1em;
  text-align: center;

  @media (max-height: 660px) {
    padding-top: 2em;
    padding-bottom: 2em;
  }

  h1,
  ${OptionList} {
    opacity: ${(p) => (p.isActive ? "1" : ".65")};
  }

  ${(p) => (p.theme.section ? { ...p.theme.section } : "")}
`;

const Wrapper = styled.div`
  ${(p) => (p.theme.container ? { ...p.theme.container } : "")}
`;

const Form = styled.form``;

const DefaultButton = styled.button``;

const scrollToRef = (ref) => {
  if (typeof window !== "undefined") {
    const top = ref.current.offsetTop;
    window.scrollTo({
      top,
      left: 0,
      behavior: "smooth",
    });
  }
};

export default function Questionnaire({
  formData,
  introComponent = defaults.introComponent,
  startLabel = "Start",
  nextLabel = "Next",
  loadingMessage = "Loading your results...",
  finishLabel = "Get Results",
  height = "65vh",
  button = DefaultButton,
  getResultsFn = defaults.getResultsFn,
  resultsComponent = defaults.resultsComponent,
  theme = {},
}) {
  const useForm = (initialValues = {}) => {
    const [values, setValues] = useState(initialValues);
    const handleChange = (ev) => {
      const { name } = ev.target;
      const value =
        ev.target.type === "checkbox" ? ev.target.checked : ev.target.value;
      setValues({ ...values, [name]: value });
    };
    const handleSubmit = (ev) => {
      return ev.preventDefault();
    };
    return { values, handleChange, handleSubmit };
  };

  const useCounters = () => {
    const [counters, setCounters] = useState({});
    const handleCounterChange = (questionId, state = true) => {
      const currentCounter =
        typeof counters[questionId] === "number"
          ? Number(counters[questionId])
          : 0;
      const count = state ? 1 : -1;
      setCounters({
        ...counters,
        [questionId]: currentCounter + count,
      });
    };
    const getCurrentCount = (id) => {
      return counters[id] || 0;
    };
    return { counters, handleCounterChange, getCurrentCount };
  };

  const { values, handleChange, handleSubmit } = useForm();
  const { counters, handleCounterChange, getCurrentCount } = useCounters();
  const [results, setResults] = useState([]);
  const [formStep, updateFormStep] = useState(-1);
  // Make the components titlecase, for stylistic purposes only
  const IntroComponent = introComponent;
  const ResultsComponent = resultsComponent;
  const Button = button;

  // Setup the refs to use for auto-scrolling
  const questionRefs = formData.questions.map(() => {
    console.log("setting up ref");
    return useRef(null);
  });
  const resultsRef = useRef(null)

  const scrollToSection = (section) => {
    if(typeof section === 'number') {
      return scrollToRef(questionRefs[section]);
    }
    return scrollToRef(resultsRef)
  };

  const handleFinishAction = () => {
    updateFormStep("loading");
    if (typeof getResultsFn === "function") {
      getResultsFn(values)
        .then((results) => {
          setResults(results);
          updateFormStep("finished");
        })
        .catch(() => {
          updateFormStep("error");
        });
    }
  };

  if (formStep === -1) {
    return (
      <Wrapper theme={theme}>
        <Section isActive={true} height={height} theme={theme}>
          <IntroComponent>
            <Button onClick={() => updateFormStep(0)}>{startLabel}</Button>
          </IntroComponent>
        </Section>
      </Wrapper>
    );
  }

  if (formStep === "loading") {
    return (
      <Wrapper theme={theme}>
        <Section isActive={true} height={height} theme={theme}>
          <h1>{loadingMessage}</h1>
        </Section>
      </Wrapper>
    );
  }

  if (formStep === "finished") {
    return (
      <Wrapper theme={theme}>
        <Section isActive={true} height={height} theme={theme}>
          <ResultsComponent results={results} />
        </Section>
      </Wrapper>
    );
  }

  if (formStep === "error") {
    return (
      <Wrapper theme={theme}>
        <Section isActive={true} height={height} theme={theme}>
          <h1>Oh no!</h1>
          <h4>It looks like there was no results. Try again below:</h4>
          <Button onClick={() => updateFormStep(0)}>{startLabel}</Button>
        </Section>
      </Wrapper>
    );
  }

  return (
    <Wrapper theme={theme}>
      <Form onSubmit={handleSubmit}>
        {formData.questions.map((question, index) => {
          const currentCount = getCurrentCount(question.id);
          const maxSelections = question.max_selections || false;
          const isAtLimit = maxSelections && currentCount >= maxSelections;
          return (
            <Section
              isActive={index === formStep}
              height={height}
              theme={theme}
              key={index}
              ref={refs[index]}
            >
              <h1>{question.label}</h1>
              {!!maxSelections && !currentCount && (
                <Limitation>Choose up to {maxSelections}</Limitation>
              )}
              {!!maxSelections && !!currentCount && (
                <Limitation>
                  {currentCount} of {maxSelections}
                </Limitation>
              )}
              <OptionList>
                {question.options.map((option) => {
                  const { key, label } = option;
                  return (
                    <DisplayOptionWrapper key={key}>
                      <input
                        type="checkbox"
                        disabled={!values[key] && isAtLimit}
                        onChange={(ev) => {
                          handleChange(ev);
                          handleCounterChange(question.id, ev.target.checked);
                        }}
                        checked={values[key]}
                        name={key}
                      />
                      <DisplayOption theme={theme}>{label}</DisplayOption>
                    </DisplayOptionWrapper>
                  );
                })}
              </OptionList>
              {index >= formData.questions.length - 1 ? (
                <Button
                  onClick={() => {
                    scrollToResults();
                    handleFinishAction();
                  }}
                >
                  {finishLabel}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    scrollToSection(index + 1);
                    updateFormStep(index + 1);
                  }}
                >
                  {nextLabel}
                </Button>
              )}
            </Section>
          );
        })}

        <p>
          <small>
            Selected tags:
            {Object.keys(values).map((key, index) => {
              return values[key]
                ? ` ${key}${Object.keys(values).length > index ? "," : "."}`
                : null;
            })}
          </small>
        </p>
      </Form>
    </Wrapper>
  );
}
