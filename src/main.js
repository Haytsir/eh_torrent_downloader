import waitForKeyElements from './lib/waitForKeyElements.js';
const torrentMap = new Map();

function getLinkUrl(targetEl) {
    if (!targetEl.onclick) return null;
    let tFn = targetEl.onclick.toString();
    return tFn.slice(tFn.indexOf('\'') + 1, tFn.lastIndexOf('\''));
}

function getTorrentInfo(targetEl) {
    console.log(targetEl);
    if (!targetEl) return null;
    let result = new Map();
    for (let i = 0; i < targetEl.children.length; i++) {
        const data = targetEl.children.item(i);
        if (data.textContent.length < 1) continue;
        let [infoName, ...rest] = data.textContent.split(":");
        let infoData = rest.join(":");
        result.set(infoName.toLowerCase(), infoData);
    }
    return result;
}

function download(link, filename) {
    if (!link || link.length < 10) return;
    var request = new XMLHttpRequest();

    request.onload = function (event) {
        var blob = request.response;

        if (request.status === 200) {
            console.log(event)
            var link = document.createElement('a');

            link.href = window.URL.createObjectURL(blob);
            /* var filename = "";
            const dispotion = request.getResponseHeader("Content-Disposition");
            if (dispotion && dispotion.indexOf('attachment') !== -1) {
                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(dispotion);
                if (matches != null && matches[1]) {
                    filename = (matches[1].replace(/['"]/g, ''));
                }
            } */
            link.download = filename;
            link.click();
            setTimeout(() => { window.close(); }, 750);

            //call your method her to do anything
        }
    };
    request.open('GET', link, true);

    request.setRequestHeader("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7");
    request.setRequestHeader("accept-language", "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7");
    request.setRequestHeader("upgrade-insecure-requests", "1");
    request.responseType = 'blob';


    request.send();
}

waitForKeyElements("body > .stuffbox > #torrentinfo > div:nth-child(1)", (content) => {
    console.log('start');
    let target = null;
    const forms = content.querySelectorAll("form");
    forms.forEach((form) => {
        console.log(form);
        let info = getTorrentInfo(form.querySelector("div > table > tbody > tr:nth-child(1)"));
        if (!info) return;
        let td = form.querySelector("div > table > tbody > tr:nth-child(3) > td");
        info.set('name', td.textContent.trim());
        const link = getLinkUrl(td.querySelector("a"));
        if (link) info.set('link', link);
        torrentMap.set(form, info);
    });

    console.log(torrentMap);

    if (forms.length == 1) {
        target = forms[0];
    } else {
        return; // TODO:여러개인 상황 구현
    }

    if (!target) return;
    const info = torrentMap.get(target);
    if (!info.has("link")) return;

    download(info.get("link"), info.get("name") + ".torrent");
});


