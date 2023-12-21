
import React, { Component } from 'react';
class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedIframe: null,
      iframes: this.createIframeProxy(),
    };
    this.iframeRefs = {}; // Store iframe refs
  }

  componentDidMount() {
    // Attach event listeners to iframe refs
    Object.keys(this.iframeRefs).forEach((iframe) => {
      this.iframeRefs[iframe].addEventListener('load', () => {
        this.updateIframeContents(iframe);
      });
    });
  }

  createIframeProxy = () => {
    // Create a proxy for the iframes object to observe changes
    const initialIframes = {
      iframe1: {
        textField1: "Text Field 1",
        div1: "Div 1",
        button1: "Click me",
        paragraph1: "Paragraph 1",
        textField2: "Text Field 2",
        div2: "Div 2",
        button2: "Click me",
      },
      iframe2: {
        textFieldA: "Text Field A",
        divA: "Div A",
        buttonA: "Click me A",
        paragraphA: "Paragraph A",
      },
      iframe3: {
        textFieldX: "Text Field X",
        divX: "Div X",
        buttonX: "Click me X",
        paragraphX: "Paragraph X",
        textFieldY: "Text Field Y",
        divY: "Div Y",
      },
      iframe4: {
        textFieldZ: "Text Field Z",
        divZ: "Div Z",
        buttonZ: "Click me Z",
        paragraphZ: "Paragraph Z",
        textFieldW: "Text Field W",
        divW: "Div W",
        buttonW: "Click me W",
        paragraphW: "Paragraph W",
      },
      // Add more iframes and their contents as needed
    };

    return new Proxy(initialIframes, {
      set: (target, key, value) => {
        // Create a new object to avoid mutating the state directly
        const newIframes = { ...target };
        newIframes[key] = value;
        // Update the state using setState
        this.setState({ iframes: newIframes });
        return true;
      },
    });
  };

  handleInputChange = (iframe, key, value) => {
    // Use setState to set the value
    this.setState((prevState) => {
      const updatedIframes = {
        ...prevState.iframes,
        [iframe]: {
          ...prevState.iframes[iframe],
          [key]: value,
        },
      };
      return { iframes: updatedIframes };
    });
  };

  renderInputs = () => {
    if (!this.state.selectedIframe) return null;
    const currentIframe = this.state.iframes[this.state.selectedIframe];
    return Object.keys(currentIframe).map((key) => (
      <div key={key} style={{ margin: '10px 0' }}>
        <label htmlFor={key} style={{ marginRight: '10px' }}>
          {key}
        </label>
        <input
          id={key}
          value={currentIframe[key]}
          onChange={(e) =>
            this.handleInputChange(this.state.selectedIframe, key, e.target.value)
          }
          placeholder={`Enter ${key}`}
        />
      </div>
    ));
  };

  renderIframes = () => {
    const iframeKeys = Object.keys(this.state.iframes);
    const iframeCount = iframeKeys.length;
    const iframeWidth = `${100 / iframeCount}%`; // Distribute iframes evenly

    return (
      <div style={{ margin: '20px' }}>
        <h4 style={{ color: '#68cf48' }}>Dynamic Iframe Editor</h4>
        <div style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto' }}>
          {iframeKeys.map((iframe) => (
            <div key={iframe} style={{ width: iframeWidth, cursor: 'pointer' }}>
              <h4
                style={{
                  color: '#68cf48',
                  textDecoration:
                    this.state.selectedIframe === iframe ? 'underline' : 'none',
                }}
                onClick={() => this.selectIframe(iframe)}
              >
                {iframe}
              </h4>
              {Object.keys(this.state.iframes[iframe]).map((key) => (
                <div key={key}>
                  {key.startsWith('textField') && (
                    <input type="text" value={this.state.iframes[iframe][key]} readOnly />
                  )}
                  {key.startsWith('div') && (
                    <div>{this.state.iframes[iframe][key]}</div>
                  )}
                  {key.startsWith('button') && (
                    <button>{this.state.iframes[iframe][key]}</button>
                  )}
                  {!key.startsWith('textField') && !key.startsWith('div') && !key.startsWith('button') && (
                    <p>{this.state.iframes[iframe][key]}</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  selectIframe = (iframe) => {
    this.setState({ selectedIframe: iframe });
  };

  updateIframeContents = (iframe) => {
    const doc = this.iframeRefs[iframe].contentDocument;
    const selectedIframeContents = this.state.iframes[iframe];

    // Check if an iframe is selected
    if (iframe) {
      let contentHtml = '<div style="padding: 20px;">';
      for (const key in selectedIframeContents) {
        const content = selectedIframeContents[key];
        if (key.startsWith('textField')) {
          contentHtml += `<input type="text" value="${content}" readonly />`;
        } else if (key.startsWith('div')) {
          contentHtml += `<div>${content}</div>`;
        } else if (key.startsWith('button')) {
          contentHtml += `<button>${content}</button>`;
        } else {
          contentHtml += `<p>${content}</p>`;
        }
      }
      contentHtml += '</div>';
      doc.body.innerHTML = contentHtml;
    } else {
      // Clear the iframe contents if no iframe is selected
      doc.body.innerHTML = '';
    }
  };

  render() {
    return (
      <div>
        {this.renderIframes()}
        {this.renderInputs()}
      </div>
    );
  }
}

export default App;

