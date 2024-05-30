const menu = (() => {
    const modeSelect = (setMode) => (event) => {
        document.body.innerHTML = '';
        setMode(event.target.dataset.mode);
    };

    const generateMenu = (setMode) => {
        const body = document.querySelector('body');
        body.innerHTML = '';

        const solo = document.createElement('button');
        const vs = document.createElement('button');

        solo.innerHTML = 'solo';
        vs.innerHTML = 'vs';
        solo.dataset.mode = 'solo';
        vs.dataset.mode = 'vs';

        solo.addEventListener('click', modeSelect(setMode));
        vs.addEventListener('click', modeSelect(setMode));

        body.append(solo);
        body.append(vs);
    };

    return { generateMenu, modeSelect };
})();

module.exports = menu;
