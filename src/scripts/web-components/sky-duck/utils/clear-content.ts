import { resetLoaderMessages } from './reset-loader-messages';

export const clearContent = function clearContent(): void {
    const nodesToRemove = Array.from(this.shadowRoot.children).filter((child: HTMLElement) => {
        const isStyleTag = /style/i.test(child.nodeName);
        const isRenderOnce = child.classList.contains('--render-once');

        return !isStyleTag && !isRenderOnce;
    });

    nodesToRemove.forEach((node: HTMLElement) => {
        node.parentNode.removeChild(node);
    });

    resetLoaderMessages.call(this);
};
