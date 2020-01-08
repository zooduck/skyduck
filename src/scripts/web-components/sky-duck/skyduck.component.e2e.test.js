describe('sky-duck', () => {
    let el;
    const timeoutToConnectToDOM = 50;
    const timeoutToFirstLoadStarted = 1000;
    const timeoutToFirstLoadCompleted = 10000;

    beforeAll(async () => {
        jest.setTimeout(11000);
        await page.goto(LOCALHOST);
    });

    describe('with location attribute set', () => {
        describe('good location', () => {
            beforeEach(async () => {
                await page.setContent(`
                    <sky-duck location="tokyo"></sky-duck>
                `);
            });

            describe('init', () => {
                beforeAll(async () => {
                    await page.setContent(`
                        <sky-duck location="tokyo"></sky-duck>
                    `);
                    el = await page.$('sky-duck');
                    await page.waitFor(timeoutToConnectToDOM);
                });

                it('should have the correct modifier classes when attached to the dom', async () => {
                    const modifierClasses = await page.evaluate((el) => {
                        return Array.from(el.classList);
                    }, el);

                    expect(modifierClasses.sort()).toEqual([
                        '--init',
                        '--loading',
                    ]);
                });
            });

            describe('load started', () => {
                beforeAll(async () => {
                    await page.reload();
                    await page.setContent(`
                        <sky-duck location="tokyo"></sky-duck>
                    `);
                    el = await page.$('sky-duck');
                    await page.waitFor(timeoutToConnectToDOM + timeoutToFirstLoadStarted);
                });

                it('should have the correct modifier classes applied', async () => {
                    const modifierClasses = await page.evaluate((el) => {
                        return Array.from(el.classList);
                    }, el);

                    expect(modifierClasses.sort()).toEqual([
                        '--init',
                        '--loading',
                    ]);
                });

                it('should display a loader', async () => {
                    const loader = await page.evaluate((el) => {
                        return el.shadowRoot.querySelector('#skyduckLoader');
                    }, el);

                    expect(loader).toBeDefined();
                });

                it('should have a style tag', async () => {
                    const style = await page.evaluate((el)  => {
                        return el.shadowRoot.querySelector('style');
                    }, el);

                    expect(style).toBeDefined();
                });
            });

            describe('load completed', () => {
                beforeAll(async () => {
                    await page.reload();
                    await page.setContent(`
                        <sky-duck location="tokyo"></sky-duck>
                    `);
                    el = await page.$('sky-duck');
                    await page.waitFor(timeoutToConnectToDOM + timeoutToFirstLoadCompleted);
                });

                it('should have the correct modifier classes applied', async () => {
                    const modifierClasses = await page.evaluate((el) => {
                        return Array.from(el.classList);
                    }, el);

                    expect(modifierClasses).toEqual([
                        '--ready',
                    ]);
                });

                it('should display header and search', async () => {
                    const header = await page.evaluate((el) => {
                        return el.shadowRoot.querySelector('.header');
                    }, el);

                    const search =  await page.evaluate((el) => {
                        return el.shadowRoot
                            .querySelector('.search')
                            .querySelector('zooduck-input [label="Location Search"]');
                    }, el);

                    expect(header).toBeDefined();
                    expect(search).toBeDefined();
                });

                it('should display location details and map', async () => {
                    const locationInfo = await page.evaluate((el) => {
                        return el.shadowRoot
                            .querySelector('.club-info-grid-location-info').innerText;
                    }, el);

                    const googleMap = await page.evaluate((el) => {
                        return el.shadowRoot
                            .querySelector('.club-info-grid')
                            .querySelector('iframe[src*="https://google.com"]');
                    }, el);

                    expect(locationInfo).toContain('Tokyo');
                    expect(googleMap).toBeDefined();
                });

                it('should display a forecast carousel with 8 slides', async () => {
                    const forecastCarouselSlides = await page.evaluate((el) => {
                        return el.shadowRoot
                            .querySelector('#forecastCarousel')
                            .querySelector('[slot=slides]').children.length;
                    }, el);

                    expect(forecastCarouselSlides).toEqual(8);
                });

                it('should display a club list carousel with at least 5 slides', async () => {
                    const clubListCarouselSlides = await page.evaluate((el) => {
                        return el.shadowRoot
                            .querySelector('#clubListCarousel')
                            .querySelector('[slot=slides]').children.length;
                    }, el);

                    expect(clubListCarouselSlides).toBeGreaterThanOrEqual(5);
                });
            });
        });

        describe('bad location', () => {
            describe('load completed', () => {
                beforeAll(async () => {
                    await page.reload();
                    await page.setContent(`
                        <sky-duck location="DOMPER"></sky-duck>
                    `);
                    el = await page.$('sky-duck');
                    await page.waitFor(timeoutToConnectToDOM + timeoutToFirstLoadCompleted);
                });

                it('should only display header and search when the location could not be resolved', async () => {
                    const childNodes = await page.evaluate((el) => {
                        return el.shadowRoot.children.length;
                    }, el);

                    const style = await page.evaluate((el) => {
                        return el.shadowRoot.querySelector('style');
                    }, el);

                    const loader = await page.evaluate((el) => {
                        return el.shadowRoot.querySelector('#skyduckLoader');
                    }, el);

                    const header = await page.evaluate((el) => {
                        return el.shadowRoot.querySelector('.header');
                    }, el);

                    const clubList = await page.evaluate((el) => {
                        return el.shadowRoot.querySelector('#clubListCarousel');
                    }, el);

                    const search =  await page.evaluate((el) => {
                        return el.shadowRoot
                            .querySelector('.search')
                            .querySelector('zooduck-input [label="Location Search"]');
                    }, el);

                    expect(childNodes).toEqual(5);

                    expect(style).toBeDefined();
                    expect(loader).toBeDefined();
                    expect(header).toBeDefined();
                    expect(search).toBeDefined();
                    expect(clubList).toBeDefined();
                });

                it('should display the loader with an error', async () => {
                    const error = await page.evaluate((el) => {
                        return el.shadowRoot
                            .querySelector('#skyduckLoader')
                            .querySelector('#loaderError').innerHTML;
                    }, el);

                    expect(error).toEqual('Error: Unable to resolve coordinates for location of \"DOMPER.\"');
                });

                it('should display the loader with an error until dismissed by the user', async () => {
                    let loaderDisplay = await page.evaluate((el) => {
                        const loader = el.shadowRoot
                            .querySelector('#skyduckLoader');

                        return getComputedStyle(loader).getPropertyValue('display');
                    }, el);

                    expect(loaderDisplay).toEqual('grid');

                    const loader = await page.evaluateHandle((el) => {
                        return el.shadowRoot.querySelector('#skyduckLoader');
                    }, el);

                    await loader.tap();
                    await page.waitFor(100);

                    loaderDisplay = await page.evaluate((el) => {
                        const loader = el.shadowRoot.querySelector('#skyduckLoader');

                        return getComputedStyle(loader).getPropertyValue('display');
                    }, el);

                    expect(loaderDisplay).toEqual('none');
                });
            });
        });
    });
});
