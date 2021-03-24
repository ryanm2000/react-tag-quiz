UI to create a series of questions with multiple choice answers that get fed into a simple function that outputs the results. BYO function.

# Installation
- `npm install react-tag-quiz`
- `import Quiz from 'react-tag-quiz`
# Sample Usage
```
<Quiz 
  formData={{questions[...]}}
  introComponent={<div>{children}</div>}
  getResultsFn={answers => {
    // Fetch or generate answers
    // Return answers object
  }}
  theme={{
    section: {
      color: '#fff',
    },
    color: {
      background: 'tomato',
      foreground: '#fff',
    },
  }}
/>
```

## Required Props

Prop Name | Type | Example
--------- | --- | ---
`formData` | Object | <code lang="json">{questions: [{label: 'What is your favourite colour?',options: [{ key: 'red', label: 'Red' },{ key: 'blue', label: 'Blue' },],},{...}],}</code>
`introComponent` | Component | `<div><h1>Want to do the questionnaire? Click the button below to get started</h1>{children}</div>`
`getResultsFn` | Function | `(selectedValues) => {}`


## Optional Props
Prop Name | Type | Default
--------- | --- | ---
`button` | Component | ?
`startLabel` | String | "Start"
`nextLabel` | String | "Next"
`loadingMessage` | String | "Loading your results..."
`finishLabel` | String | "Get Results"
`height` | String | "65vh"
`resultsComponent` | Component | ?
`theme` | Object | <code lang="json">{}</code>
`resetSelectionsOnRestart` | Boolean | true


### Developing locally
- Create a symlink for this repo. From this directory `npm link`
- To use it in another project, from _that_ directory, run `npm link ../[path_to_this_repo]` 
- There will also likely be missing react/styled-component messages. If so, `npm link react` from this directory should fix
- If there are subseuqne tmessages about invalid react hook calls, it is likely that the consuming project is seeing two versions of react. To fix this temporarily, from this directory `npm link ../[path_to_consumer_project]/node_modules/[react|react-dom|styled-components]`. See [here](https://reactjs.org/warnings/invalid-hook-call-warning.html).