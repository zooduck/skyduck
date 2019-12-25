/*
/* Add these to puppeteer test suites as necessary. Using import will not work.
*
*/
const clearInput = async (page, input) => {
    await page.evaluate(async (input) => {
        input.select();
    }, input);

    await input.press('Backspace');
};

const getElementFromShadow = async (page, el, selector) => await page.evaluateHandle(shadowSelector, el, selector);
const shadowSelector = (el, selector) => el.shadowRoot.querySelector(selector);

const getProperty = async (node, prop) => {
    const _prop = await node.getProperty(prop);

    return await _prop.jsonValue();
};
const getAttribute = async (page, node, attr) => {
    const _attr = await page.evaluate((node, attr) => {
        return node.getAttribute(attr);
    }, node, attr);

    return _attr;
};
const getClassList = async (page, el) =>  await page.evaluate((el) => Array.from(el.classList), el);
const getComputedStyleProperty = async (page, el, prop) => {
    const element = (el.constructor.name === 'Array') ? el[0] : el;
    const pseudoEl = (el.constructor.name === 'Array' && el[1]) ? el[1] : undefined;
    return await page.evaluate((el, pseudoEl, prop) => {
        if (pseudoEl) {
            return getComputedStyle(el, pseudoEl).getPropertyValue(prop);
        } else {
            return getComputedStyle(el).getPropertyValue(prop);
        }
    }, element, pseudoEl, prop);
};
