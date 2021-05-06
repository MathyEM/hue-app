function setContainerHeight(elem) {
    let height = elem.style.height;

    if (height !== "0px") {
        elem.style.height = 0;
        return
    }
    elem.style.height = elem.scrollHeight + "px";
}

export { setContainerHeight }