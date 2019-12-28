describe('HTMLZooduckIconBaseElement', () => {
    beforeAll(async () => {
        await page.goto(`${PATH}/index.test.html`);
    });

    it('should have a shadowRoot', async () => {
        await page.setContent(`
            <zooduck-icon-base></zooduck-icon-base>
        `);

        const el = await page.$('zooduck-icon-base');

        const shadowRoot = await page.evaluate((el) => el.shadowRoot, el);

        expect(shadowRoot).not.toBeNull();
    });

    it('should sync attributes to properties', async () => {
        await page.setContent(`
            <zooduck-icon-base
                backgroundcolor="potato"
                color="tomato"
                size="100">
            </zooduck-icon-base>
        `);

        const el = await page.$('zooduck-icon-base');

        const props = await page.evaluate((el) => {
            return [
                el.backgroundcolor,
                el.color,
                el.size,
            ];
        }, el);

        expect(props).toEqual([
            'potato',
            'tomato',
            '100',
        ]);

    });

    it('should sync properties to attributes', async () => {
        await page.setContent(`
            <zooduck-icon-base></zooduck-icon-base>
        `);

        const el = await page.$('zooduck-icon-base');

        let attrs = await page.evaluate((el) => {
            return [
                el.getAttribute('backgroundcolor'),
                el.getAttribute('color'),
                el.getAttribute('size'),
            ];
        }, el);

        expect(attrs).toEqual([
            null,
            null,
            null,
        ]);

        await page.evaluate((el) => {
            el.backgroundcolor = 'a';
            el.color = 'b';
            el.size = '1';
        }, el);

        attrs = await page.evaluate((el) => {
            return [
                el.getAttribute('backgroundcolor'),
                el.getAttribute('color'),
                el.getAttribute('size'),
            ];
        }, el);

        expect(attrs).toEqual([
            'a',
            'b',
            '1',
        ]);
    });
});
