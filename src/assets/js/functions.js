async function setContainerHeight(elem) {
    let height = elem.style.height;
    
    function setScrollHeight() {
        return new Promise(resolve => {
            elem.style.height = elem.scrollHeight + "px";
            setTimeout(() => {
                resolve();
            }, 1)
        })
    }

    if (height !== "0px") {
        await setScrollHeight();
        elem.style.height = 0;
        return
    }
    elem.style.height = elem.scrollHeight + "px";
}

export { setContainerHeight }