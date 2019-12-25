const customElementsV1Supported = 'customElements'  in window;
if (!customElementsV1Supported) {
    document.write('<div style="text-align: center">Your browser does not support <a href="https://caniuse.com/#search=custom%20element">Custom Elements.</a></div>');
}
