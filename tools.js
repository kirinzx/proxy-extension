const enableSite_html = `
                <strong class="fs-2">Configure your proxy</strong>
                <button id="enableSite" class="turn-btn">
                    <svg>
                        <use xlink:href="#turn-button"></use>
                    </svg>
                </button>
            `;
        
const disableSite_html = `
                <strong class="fs-2">Configure your proxy</strong>
                <button id="disableSite" class="turn-btn"><svg>
                    <use xlink:href="#turn-button"></use>
                    </svg>
                </button>
            `;

function getProxyDataHtml(proxy){ 
    return  `
                <strong class="mb-2">My proxy data</strong>
                <div class="d-flex flex-column">
                    <p class="fs-4 fw-normal mb-1"><span class="fw-bold">Ip:</span> ${proxy.ip}</p>
                    <p class="fs-4 fw-normal mb-1"><span class="fw-bold">Port:</span> ${proxy.port}</p>
                    <p class="fs-4 fw-normal mb-1"><span class="fw-bold">Username:</span> ${proxy.username}</p>
                    <p class="fs-4 fw-normal mb-1"><span class="fw-bold">Password:</span> ${proxy.password}</p>
                    <button id="changeProxy" type="button" class="btn btn-outline-primary border-2 mt-2">Change proxy</button>
                    <span class="fs-6 text-danger mb-0">WARNING! Once you click this button, your proxy will be removed!</span>
                </div>
            `;
}

const proxyForm_html = `
                <strong class="mb-2">My proxy data</strong>
                <div id="proxy_form_div" class="d-flex flex-column w-100">
                    <h2 class="fs-4 text-center">Proxy adding</h2>
                    <input class="form-control mb-2" type="text" id="proxyIP" placeholder="IP">
                    <input class="form-control mb-2" type="text" id="proxyPort" placeholder="Port">
                    <input class="form-control mb-2" type="text" id="proxyUsername" placeholder="Login">
                    <input class="form-control mb-2" type="text" id="proxyPassword" placeholder="Password">
                    <button id="applyProxy" type="button" class="btn btn-primary w-100">Apply Proxy</button>
                    <div id="auto-detect-div" class="d-block fs-6 mt-2 d-flex align-items-center">
                        <span title="You can visit this site proxy6.net/user/proxy and push button. I will detect proxy myself" class="me-1">
                            <svg class="question-svg">
                                <use xlink:href="#question"></use>
                            </svg>
                        </span>
                        <span id="auto-detect-span" class="text-decoration-underline text-primary">Auto detect</span>
                    </div>
                </div>
            `;

function getAutoDetectErrorHTML(textError){
    return `<span class="text-danger fs-6 mb-0 ms-2 fw-light">${textError}</span>`
} 

const regular_ip = new RegExp(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/);

const non_clickable_html = '<span id="site-enabling-error" class="text-danger fs-5 fw-light mb-0">Add proxy first</span>';

function getErrorHtml(text){
    return `<p class="mt-1 mb-0 fw-light fs-6 text-danger">${text}</p>`
}

export {regular_ip, proxyForm_html, getProxyDataHtml,disableSite_html,enableSite_html, getErrorHtml, non_clickable_html, getAutoDetectErrorHTML};