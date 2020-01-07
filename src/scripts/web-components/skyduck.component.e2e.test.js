describe('sky-duck', () => {
    beforeAll(async () => {
        jest.setTimeout(10000);

        await page.goto(LOCALHOST);
        const el = await page.$('sky-duck');
        await page.evaluate((el) => {
            el.parentNode.removeChild(el);
        }, el);
    });

    describe('with location attribute set', () => {
        it ('should render with shadow', async () => {
            await page.setContent(`
                <sky-duck location="tokyo"></sky-duck>
            `);

            const el = await page.$('sky-duck');

            const shadowRoot = await page.evaluate((el) => {
                return el.shadowRoot;
            }, el);

            expect(shadowRoot).toBeTruthy();
        });

        it('should have the correct modifier classes when attached to the dom', async () => {
            await page.setContent(`
                <sky-duck location="tokyo"></sky-duck>
            `);

            const el = await page.$('sky-duck');

            await page.waitFor(500);

            const modifierClasses = await page.evaluate((el) => {
                return Array.from(el.classList);
            }, el);

            expect(modifierClasses).toEqual([
                '--loading',
                '--init',
            ]);
        });

        it('should display the correct modifier classes after on first load', async () => {
            await page.setContent(`
                <sky-duck location="tokyo"></sky-duck>
            `);

            const el = await page.$('sky-duck');

            await page.waitFor(5500);

            let modifierClasses = await page.evaluate((el) => {
                return Array.from(el.classList);
            }, el);

            expect(modifierClasses).toEqual([
                '--loading',
                '--ready',
            ]);

            await page.waitFor(500);

            modifierClasses = await page.evaluate((el) => {
                return Array.from(el.classList);
            }, el);

            expect(modifierClasses).toEqual([
                '--ready',
            ]);
        });
    });
});
