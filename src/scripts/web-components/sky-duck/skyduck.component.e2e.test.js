import { DateTime } from 'luxon';

describe('zooduck-skyduck', () => {
    let el;
    const timeoutToConnectToDOM = 100;
    const timeoutToFirstLoadStarted = 2000;
    const timeoutToFirstLoadCompleted = 10000;

    beforeAll(async () => {
        jest.setTimeout(timeoutToConnectToDOM + timeoutToFirstLoadStarted + timeoutToFirstLoadCompleted);

        page.on('pageerror', (err) => {
            console.log('pageerror:', err);
        });
    });

    describe('with geolocation disabled', () => {
        describe('with no attributes set', () => {
            beforeAll(async () => {
                await page.goto(LOCALHOST);
            });

            describe('load completed', () => {
                beforeAll(async () => {
                    await page.setContent(`
                        <zooduck-skyduck></zooduck-skyduck>
                    `);

                    el = await page.$('zooduck-skyduck');

                    await page.waitFor(timeoutToConnectToDOM + timeoutToFirstLoadCompleted);
                });

                it('should have the correct modifier classes applied', async () => {
                    const modifierClasses = await page.evaluate((el) => {
                        return Array.from(el.classList);
                    }, el);

                    expect(modifierClasses.sort()).toEqual([
                        '--active-carousel-forecast',
                        '--forecast-display-mode-standard',
                        '--ready',
                    ]);
                });

                it('should display a geolocation disabled warning', async () => {
                    const geolocationError = await page.evaluate((el) => {
                        return el.shadowRoot.querySelector('#geolocationError');
                    }, el);

                    expect(geolocationError).not.toBeNull();
                });

                it('should display a settings page', async () => {
                    const settingsPage = await page.evaluate((el) => {
                        return el.shadowRoot.querySelector('#settings');
                    }, el);

                    const settingsPageElements = await page.evaluate((el) => {
                        const settingsPage = el.shadowRoot.querySelector('#settings');
                        const settings = [
                            '#locationSearchInput',
                            '#map',
                            '#locationInfo',
                            '#activeCarouselSetting',
                            '#forecastDisplayModeSetting',
                            '#useCurrentLocationSetting',
                            '#setCurrentLocationSetting',
                        ].map((selector) => {
                            return settingsPage.querySelector(selector);
                        });

                        return settings;
                    }, el);

                    expect(settingsPage).not.toBeNull();

                    settingsPageElements.forEach((el) => {
                        expect(el).not.toBeNull();
                    });
                });
            });
        });

        describe('with club attribute set', () => {
            describe('good club', () => {
                beforeAll(async () => {
                    await page.goto(LOCALHOST);
                });

                describe('load completed', () => {
                    beforeAll(async () => {
                        await page.setContent(`
                            <zooduck-skyduck club="skydive algarve"></zooduck-skyduck>
                        `);

                        el = await page.$('zooduck-skyduck');

                        await page.waitFor(timeoutToConnectToDOM + timeoutToFirstLoadCompleted);
                    });

                    it('should have the correct modifier classes applied', async () => {
                        const modifierClasses = await page.evaluate((el) => {
                            return Array.from(el.classList);
                        }, el);

                        expect(modifierClasses.sort()).toEqual([
                            '--active-carousel-forecast',
                            '--forecast-display-mode-standard',
                            '--ready',
                        ]);
                    });
                });
            });

            describe('bad club', () => {
                beforeAll(async () => {
                    await page.goto(LOCALHOST);
                });

                describe('load completed', () => {
                    beforeAll(async () => {
                        await page.setContent(`
                            <zooduck-skyduck club="SKYDIVEAPOTAMUS"></zooduck-skyduck>
                        `);

                        el = await page.$('zooduck-skyduck');

                        await page.waitFor(timeoutToConnectToDOM + timeoutToFirstLoadCompleted);
                    });

                    it('should have the correct modifier classes applied', async () => {
                        const modifierClasses = await page.evaluate((el) => {
                            return Array.from(el.classList);
                        }, el);

                        expect(modifierClasses.sort()).toEqual([
                            '--error',
                            '--init',
                            '--loading',
                        ]);
                    });
                });
            });
        });

        describe('with location attribute set', () => {
            describe('good location', () => {
                beforeAll(async () => {
                    await page.goto(LOCALHOST);
                });

                describe('init', () => {
                    beforeAll(async () => {
                        await page.setContent(`
                            <zooduck-skyduck location="tokyo"></zooduck-skyduck>
                        `);
                        el = await page.$('zooduck-skyduck');
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
                        await page.setContent(`
                            <zooduck-skyduck location="tokyo"></zooduck-skyduck>
                        `);
                        el = await page.$('zooduck-skyduck');
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

                        expect(loader).not.toBeNull();
                    });

                    it('should have a style tag', async () => {
                        const style = await page.evaluate((el)  => {
                            return el.shadowRoot.querySelector('style');
                        }, el);

                        expect(style).not.toBeNull();
                    });
                });

                describe('load completed', () => {
                    beforeAll(async () => {
                        await page.setContent(`
                            <zooduck-skyduck location="tokyo"></zooduck-skyduck>
                        `);

                        el = await page.$('zooduck-skyduck');

                        await page.waitFor(timeoutToConnectToDOM + timeoutToFirstLoadCompleted);
                    });

                    it('should have the correct modifier classes applied', async () => {
                        const modifierClasses = await page.evaluate((el) => {
                            return Array.from(el.classList);
                        }, el);

                        expect(modifierClasses.sort()).toEqual([
                            '--active-carousel-forecast',
                            '--forecast-display-mode-standard',
                            '--ready',
                        ]);
                    });

                    it('should display a header', async () => {
                        const header = await page.evaluate((el) => {
                            return el.shadowRoot.querySelector('.header');
                        }, el);

                        expect(header).not.toBeNull();
                    });

                    it('should display a settings page', async () => {
                        const settingsPage = await page.evaluate((el) => {
                            return el.shadowRoot.querySelector('#settings');
                        }, el);

                        const settingsPageElements = await page.evaluate((el) => {
                            const settingsPage = el.shadowRoot.querySelector('#settings');
                            const settings = [
                                '#locationSearchInput',
                                '#map',
                                '#locationInfo',
                                '#activeCarouselSetting',
                                '#forecastDisplayModeSetting',
                                '#useCurrentLocationSetting',
                                '#setCurrentLocationSetting',
                            ].map((selector) => {
                                return settingsPage.querySelector(selector);
                            });

                            return settings;
                        }, el);

                        expect(settingsPage).not.toBeNull();

                        settingsPageElements.forEach((el) => {
                            expect(el).not.toBeNull();
                        });
                    });

                    it('should display a google map', async () => {
                        const map = await page.evaluate((el) => {
                            return el.shadowRoot.querySelector('#map iframe[src*="https://google.com"]');
                        }, el);

                        expect(map).not.toBeNull();
                    }, el);

                    describe('forecast', () => {
                        let dt, day;
                        const forecastHoursPerSlideInStandardMode = 3;
                        const totalSlides = 8;

                        beforeAll(async () => {
                            dt = DateTime.local().setZone('Asia/Tokyo');
                            day = dt.weekdayShort;
                        });

                        it('should display a forecast carousel with 8 slides', async () => {
                            const forecastCarouselSlides = await page.evaluate((el) => {
                                return el.shadowRoot
                                    .querySelector('#forecastCarouselStandard')
                                    .querySelector('[slot=slides]').children.length;
                            }, el);

                            expect(forecastCarouselSlides).toEqual(8);
                        });

                        it('should display a forecast for the current day on the first slide', async () => {
                            // @NOTE: This test is expected to fail if the database contains a forecast
                            // less than 1 hour old but for the previous day. In that case it would be
                            // a FALSE NEGATIVE
                            // ---------------------------------------------------------------
                            // Consider adding a no-cache attribute to force weather requests
                            // OR simply clear the database before running this test
                            //----------------------------------------------------------------
                            const forecastGridHeaderDay = await page.evaluate((el) => {
                                return el.shadowRoot
                                    .querySelector('#forecastCarouselStandard')
                                    .querySelectorAll('.forecast-grid-header-date__day')[0].innerHTML;
                            }, el);

                            expect(forecastGridHeaderDay).toEqual(day);
                        });

                        it('should display the correct number of forecast hours for standard mode', async () => {
                            const forecastHours = await page.evaluate((el) => {
                                return el.shadowRoot
                                    .querySelector('#forecastCarouselStandard')
                                    .querySelectorAll('.forecast-grid-hour').length;
                            }, el);

                            expect(forecastHours).toEqual(forecastHoursPerSlideInStandardMode * totalSlides);
                        });
                    });

                    describe('clubs', () => {
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
            });

            describe('bad location', () => {
                beforeAll(async () => {
                    await page.goto(LOCALHOST);
                });

                describe('load completed', () => {
                    beforeAll(async () => {
                        await page.setContent(`
                            <zooduck-skyduck location="DOMPER"></zooduck-skyduck>
                        `);
                        el = await page.$('zooduck-skyduck');
                        await page.waitFor(timeoutToConnectToDOM + timeoutToFirstLoadCompleted);
                    });

                    it('should not display any forecast carousels when the location could not be resolved', async () => {
                        const expectedElements = [
                            'style',
                            'loader',
                            'settings-glass',
                            'settings',
                            'sub-settings-glass',
                            'sub-settings',
                            'club-list',
                            'header',
                            'header-placeholder',
                        ];

                        const childNodes = await page.evaluate((el) => {
                            return el.shadowRoot.children.length;
                        }, el);

                        expect(childNodes).toEqual(expectedElements.length);

                        const forecastCarousels = await page.evaluate((el) => {
                            const forecastCarousels = [
                                '#forecastCarouselStandard',
                                '#forecastCarouselExtended'
                            ].map((selector) => {
                                return el.querySelector(selector);
                            });

                            return forecastCarousels;
                        }, el);

                        forecastCarousels.forEach((el) => {
                            expect(el).toBeNull();
                        });
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

                    it('should display a settings page', async () => {
                        const settingsPage = await page.evaluate((el) => {
                            return el.shadowRoot.querySelector('#settings');
                        }, el);

                        const settingsPageElements = await page.evaluate((el) => {
                            const settingsPage = el.shadowRoot.querySelector('#settings');
                            const settings = [
                                '#locationSearchInput',
                                '#map',
                                '#locationInfo',
                                '#activeCarouselSetting',
                                '#forecastDisplayModeSetting',
                                '#useCurrentLocationSetting',
                                '#setCurrentLocationSetting',
                            ].map((selector) => {
                                return settingsPage.querySelector(selector);
                            });

                            return settings;
                        }, el);

                        expect(settingsPage).not.toBeNull();

                        settingsPageElements.forEach((el) => {
                            expect(el).not.toBeNull();
                        });
                    });
                });
            });
        });
    }); // with geolocation disabled
});
