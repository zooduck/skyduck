export const skyduckLoaderErrorStyle = `
:host([active]) {
    display: flex;
}
:host(:not([active])) {
    display: none;
}
:host {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: var(--lightskyblue);
}
.skyduck-loader-error {
    padding: 10px;
    color: var(--white);
    border: solid 3px var(--white);
    max-width: 450px;
    cursor: pointer;
}
`;
