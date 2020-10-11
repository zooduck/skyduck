class HTMLSkyduckInstallerElement extends HTMLElement {
    private beforeInstallPromptEvent: any;
    private styleElement: HTMLStyleElement;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.styleElement = document.createElement('style');
        this.shadowRoot.append(this.styleElement);
    }

    protected connectedCallback() {
        this.listenForBeforeInstallPrompt().then((promptClientToInstall) => {
            if (promptClientToInstall) {
                this.render();
            } else {
                this.onInstall();
            }
        });
    }

    private async listenForBeforeInstallPrompt() {
        let promptClientToInstall = false;

        window.addEventListener('beforeinstallprompt', (event) => {
            this.beforeInstallPromptEvent = event;
            promptClientToInstall = true;

        });

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(promptClientToInstall);
            }, 500);
        });
    }

    private render() {
        this.styleElement.textContent = this.getStyle();
        this.shadowRoot.append(this.getContent());
    }

    private onInstall() {
        this.parentNode.append(document.createElement('skyduck-weather'));
        this.parentNode.removeChild(this);
    }

    private getStyle(): string {
        return `
            :host {
                z-index: 102;
                position: relative;
                width: 100%;
                height: 100vh;
                max-width: 823px;
                background-color: lightskyblue;
                color: white;
                display: flex;
                margin: 0 auto;
                align-items: center;
                justify-content: center;
            }

            header {
                position: absolute;
                right: 0;
                top: 0;
                font-family: Arial, sans-serif;
                padding: 6px;
            }

            button {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                flex-wrap: wrap;
                border: none;
                outline: none;
                font-size: 1.6rem;
                background-color: lightskyblue;
                color: white;
                cursor: pointer;
            }

            .button__icon {
                border-bottom: solid 3px white;
                padding-bottom: 6px;
                margin-bottom: 6px;
            }
        `;
    }

    private getContent(): HTMLElement {
        const containerEl = document.createElement('div');

        const headerEl = new DOMParser().parseFromString(`
            <header>
                <span>skyduck.org</span>
            </header>
        `, 'text/html').body.firstElementChild;

        const buttonEl = new DOMParser().parseFromString(`
            <button>
                <zooduck-icon-skyduck-in-flight
                    class="button__icon"
                    size="100"
                    color="white"
                    backgroundcolor="lightskyblue">
                </zooduck-icon-skyduck-in-flight>
                <a>Install app</a>
            </button>
        `, 'text/html').body.firstElementChild as HTMLElement;

        buttonEl.addEventListener('click', () => {
            if (!this.beforeInstallPromptEvent) {
                return;
            }

            this.beforeInstallPromptEvent.prompt();

            this.beforeInstallPromptEvent.userChoice.then((choice: any) => {
                if (choice.outcome === 'accepted') {
                    this.onInstall();
                }
            });
        });

        containerEl.append(headerEl, buttonEl);

        return containerEl;
    }
}

customElements.define('skyduck-installer', HTMLSkyduckInstallerElement);
