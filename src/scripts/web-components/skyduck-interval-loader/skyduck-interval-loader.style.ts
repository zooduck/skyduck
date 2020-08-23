export const skyduckIntervalLoaderStyle = `
@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(.90);
    }
    100% {
        transform: scale(1);
    }
}
@keyframes removeLayer1 {
    from {
        top: 0;
    }
    to {
        top: calc((100% + 15px) * -1);
    }
}
@keyframes removeLayer2 {
    from {
        left: 0;
    }
    to {
        left: calc((100% + 15px) * -1);
    }
}
:host([active]) {
    display: block;
}
:host(:not([active])) {
    display: none;
}

:host([loaded]) .skyduck-interval-loader__layer-1 {
    animation: removeLayer1 .25s linear both;
    animation-delay: .75s;
}

:host([loaded]) .skyduck-interval-loader__layer-2 {
    animation: removeLayer2 .25s linear both;
    animation-delay: .25s;
}
.skyduck-interval-loader {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.skyduck-interval-loader__layer-1,
.skyduck-interval-loader__layer-2 {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-shadow: 2px 2px 15px var(--gray);
    transition: all .25s;
    background-color: var(--white);
    color: var(--lightskyblue);
    font: normal 22px verdana, sans-serif;
}
.skyduck-interval-loader__layer-2 {
    background-color: var(--lightskyblue);
}
zooduck-icon-skyduck-alt {
    animation: pulse linear 1s infinite;
}
`;
