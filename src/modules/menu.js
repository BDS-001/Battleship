const menu = (() => {
    const modeSelect = (setMode) => (event) => {
        document.body.innerHTML = '';
        document.body.style.backgroundImage = 'none';
        setMode(event.target.dataset.mode);
    };

    const generateMenu = (setMode) => {
        const body = document.querySelector('body');

        const solo = document.createElement('button');
        const vs = document.createElement('button');

        solo.dataset.mode = 'solo';
        vs.dataset.mode = 'vs';
        solo.className = 'mode-select'
        solo.id = 'solo-mode'
        vs.className = 'mode-select'
        vs.id = 'vs-mode'

        solo.addEventListener('click', modeSelect(setMode));
        vs.addEventListener('click', modeSelect(setMode));

        body.append(solo);
        body.append(vs);
    };

    return { generateMenu, modeSelect };
})();

module.exports = menu;
