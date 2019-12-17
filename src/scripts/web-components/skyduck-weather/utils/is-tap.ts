export const isTap = (lastPointerdownEvent: PointerEvent, pointerupEvent: PointerEvent): boolean => {
    if (pointerupEvent.button === 2) { // right mouse button
        return false;
    }

    const maxInterval = 250;
    const maxDistance = 0;
    const distance = (lastPointerdownEvent.clientX - pointerupEvent.clientX);
    const positiveDistance = distance < 0 ? (distance * -1) : distance;

    if (positiveDistance > maxDistance) {
        return false;
    }

    return (pointerupEvent.timeStamp - lastPointerdownEvent.timeStamp) < maxInterval;
};
