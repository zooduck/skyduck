const getAttribute = async (page, node, attr) => {
    const _attr = await page.evaluate((node, attr) => {
        return node.getAttribute(attr);
    }, node, attr);

    return _attr;
};

describe('<zooduck-carousel>', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3333/index.test.html');
    });

    it('should have a shadowRoot', async () => {
        await page.setContent(`
            <zooduck-carousel>
                <div slot="slides">
                    <div>SLIDE ONE</div>
                    <div>SLIDE TWO</div>
                </div>
            </zooduck-carousel>
        `);

        const el = await page.$('zooduck-carousel');

        const shadowRoot = await page.evaluate((el) => {
            return el.shadowRoot;
        }, el);

        expect(shadowRoot).not.toBeNull()
    });

    it('should sync properties to attributes', async () => {
        await page.setContent(`
            <zooduck-carousel>
                <div slot="slides">
                    <div>SLIDE ONE</div>
                    <div>SLIDE TWO</div>
                </div>
            </zooduck-carousel>
        `);

        const el = await page.$('zooduck-carousel');

        let currentSlideAttr = await getAttribute(page, el, 'currentslide');

        expect(currentSlideAttr).toBeNull();

        await page.evaluateHandle((el) => {
            el.currentslide = 2;
        }, el);

        currentSlideAttr = await getAttribute(page, el, 'currentslide');

        expect(currentSlideAttr).toEqual('2');
    });

    it('should sync attributes to properties', async () => {
        await page.setContent(`
            <zooduck-carousel>
                <div slot="slides">
                    <div>SLIDE ONE</div>
                    <div>SLIDE TWO</div>
                </div>
            </zooduck-carousel>
        `);

        const el = await page.$('zooduck-carousel');

        let currentSlideAttr = await getAttribute(page, el, 'currentslide');

        expect(currentSlideAttr).toBeNull();

        await page.evaluateHandle((el) => {
            el.setAttribute('currentslide', '5');
        }, el);

        const propertyValues = await page.evaluate((el) => {
            return [
                el.currentslide,
            ];
        }, el);

        const expectedPropertyValues = [
            '5',
        ];

        expect(propertyValues).toEqual(expectedPropertyValues);
    });
});
