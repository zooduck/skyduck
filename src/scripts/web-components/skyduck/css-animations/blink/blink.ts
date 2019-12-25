export const blink = `
@keyframes blink {
    0% {
        visibility: visible;
    }
    49% {
        visibility: visible;
    }
    50% {
        visibility: hidden;
    }
    99% {
        visibility: hidden;
    }
    100% {
        visibility: visible;
    }
}
.--blink {
    animation: blink 1s linear infinite;
}
`;
