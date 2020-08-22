export const skyduckSplashScreenLoaderStyle = () => {
    const backgroundColor = 'lightskyblue';
    const skyduckTextLoaderNameCharAnimationDuration = .5;
    const skyduckTextLoaderNameCharDelays = Array.from({length: 7}).map((_item, index) => {
        const animationDelay = .25;
        return (index + 1) * animationDelay;
    });
    const skyduckTextLoaderBackgroundDelay = skyduckTextLoaderNameCharDelays.slice(-1)[0] + skyduckTextLoaderNameCharAnimationDuration;

    return `
@keyframes fade-in {
    0% {
        opacity: 0;
        transform: translateY(-100%);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
@keyframes slide-in {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(0);
    }
}
@keyframes switch-color {
    0% {
        color: #ffffff;
    }
    100% {
        color: ${backgroundColor};
    }
}
@keyframes progress-bar {
    0% {
        width: 0;
    }
    50% {
        width: 20%;
    }
    60% {
        width: 50%;
    }
    70% {
        width: 50%;
    }
    80% {
        width: 70%;
    }
    90% {
        width: 70%;
    }
    100% {
        width: 100%;
    }
}
:host([active]) {
    display: flex;
}
:host(:not([active])) {
    display: none;
}
.skyduck-splash-screen-loader {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--lightskyblue);
}
.skyduck-text-loader {
    display: inline-flex;
    flex-direction: column;
    height: 68px;
    position: relative;
}
.skyduck-text-loader__inner {
    position: relative;
    display: inline-grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 10px;
    align-items: center;
    padding: 10px 40px 10px 10px;
    font: normal 22px verdana, sans-serif;
    clip-path: polygon(0% 0%, 100% 0%, 100% 80px, 0% 80px);
}
.skyduck-text-loader__background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    clip-path: polygon(100% 0%, 85% 100%, 0% 100%, 0% 0%);
    animation: slide-in 250ms both;
    animation-delay: ${skyduckTextLoaderBackgroundDelay}s;
}
.skyduck-text-loader__progress {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 10px;
    background-color: rgba(255, 255, 255, .25);
}
.skyduck-text-loader__progress-bar {
    width: 0;
    height: 10px;
    background-color: #ffffff;
    animation: progress-bar 4.5s linear both;
}
.skyduck-text-loader__name {
    position: relative;
    z-index: 1;
    display: inline-flex;
    color: #ffffff;
    font-weight: bold;
    animation: switch-color 10ms both;
    animation-delay: ${skyduckTextLoaderBackgroundDelay}s;
}
.skyduck-text-loader__name-char {
    animation: fade-in ${skyduckTextLoaderNameCharAnimationDuration}s linear both;
}
${skyduckTextLoaderNameCharDelays.map((delay, index) => {
        return `
.skyduck-text-loader__name-char:nth-of-type(${index + 1}) {
    animation-delay: ${delay}s;
}
        `.trim();
    }).join('\n')}
.skyduck-text-loader__version {
    position: relative;
    z-index: 1;
    color: ${backgroundColor};
}
    `.trim();
};
