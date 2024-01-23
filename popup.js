document.addEventListener('DOMContentLoaded', function() {
    getProxyData();
    checkIfSiteAdded();
});

function checkIfSiteAdded(){
    var elementToStart = document.getElementById("siteEnabling");
    chrome.storage.sync.get('domain_list', function(domain_list){
        if (!domain_list.domain_list){
            elementToStart.innerHTML += `
                <button id="enableSite" class="turn-btn" onclick="enableSite()">
                    <svg>
                        <use xlink:href="#turn-button"></use>
                    </svg>
                </button>
            `;
            return;
        }

        chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            var domain = '';
            var currentTab = tabs[0];
            var url = new URL(currentTab.url);
            domain = url.hostname;
            var domain_splitted = domain.split(".")
            domain = domain_splitted.pop()
            domain = "." + domain_splitted.pop() + "." + domain

            if (domain_list.domain_list.indexOf(domain) == -1){

                elementToStart.innerHTML += `
                    <button id="enableSite" class="turn-btn" onclick="enableSite()">
                        <svg>
                            <use xlink:href="#turn-button"></use>
                        </svg>
                    </button>
                `;
                return;
            }

            elementToStart.innerHTML += `
                <button id="disableSite" class="turn-btn" onclick="disableSite()"><svg>
                    <use xlink:href="#turn-button"></use>
                    </svg>
                </button>
            `;
        });
    });
}

function getProxyData() {
    var proxyDataElement = document.getElementById('proxyData');
    chrome.storage.sync.get("proxy", function(data){
        if (data.proxy){
            proxyDataElement.innerHTML += `
                <div class="d-flex flex-column">
                    <p class="fs-4 fw-normal mb-1"><span class="fw-bold">Ip:</span> ${data.proxy.ip}</p>
                    <p class="fs-4 fw-normal mb-1"><span class="fw-bold">Port:</span> ${data.proxy.port}</p>
                    <p class="fs-4 fw-normal mb-1"><span class="fw-bold">Username:</span> ${data.proxy.username}</p>
                    <p class="fs-4 fw-normal mb-1"><span class="fw-bold">Password:</span> ${data.proxy.password}</p>
                    <button id="changeProxy" type="button" class="btn btn-outline-primary border-2 mt-2">Change proxy</button>
                </div>
            `;
            document.getElementById("changeProxy").addEventListener("click", changeProxy);
        }
        else{
            proxyDataElement.innerHTML += `
                <div class="d-flex flex-column w-100">
                    <h2 class="fs-4 text-center">Proxy adding</h2>
                    <input class="form-control mb-2" type="text" id="proxyIP" placeholder="IP">
                    <input class="form-control mb-2" type="text" id="proxyPort" placeholder="Port">
                    <input class="form-control mb-2" type="text" id="proxyUsername" placeholder="Login">
                    <input class="form-control mb-2" type="text" id="proxyPassword" placeholder="Password">
                    <button id="applyProxy" type="button" class="btn btn-primary w-100">Apply Proxy</button>
                    <span class="d-block fs-6 mt-2 d-flex align-items-center">
                        <span title="Or you can visit this site proxy6.net If you have proxy there, push button below" class="me-1">
                            <svg class="question-svg">
                                <use xlink:href="#question"></use>
                            </svg>
                        </span>
                        <span class="text-decoration-underline text-primary">Auto detect</span>
                    </span>
                </div>
            `;
            document.getElementById("applyProxy").addEventListener("click", applyProxy);
        }
        
    });
}


function changeProxy(){
    
}

function applyProxy() {
    var proxy = {
        "ip": document.getElementById('proxyIP'),
        "port": document.getElementById('proxyPort'),
        "username": document.getElementById('proxyUsername'),
        "password": document.getElementById('proxyPassword')
    }
    var validatedData = validateProxy(proxy);
    if (!validatedData){
        return;
    }
    proxy.ip.value = '';
    proxy.port.value = '';
    proxy.username.value = '';
    proxy.password.value = '';
    chrome.runtime.sendMessage({ action: 'applyProxy', proxy: validatedData });
}

function validateProxy(proxy){
    var valid_flag = true;

    if (!proxy.ip.value){
        proxy.ip.insertAdjacentHTML("afterend","<p>Invalid IP</p>");
        valid_flag = false;
    }
    if (!proxy.port.value){
        proxy.port.insertAdjacentHTML("afterend","<p>Invalid Port</p>");
        valid_flag = false;
    }
    if (!proxy.username.value){
        proxy.username.insertAdjacentHTML("afterend","<p>Invalid Username</p>");
        valid_flag = false;
    }
    if (!proxy.password.value){
        proxy.password.insertAdjacentHTML("afterend","<p>Invalid Password</p>");
        valid_flag = false;
    }

    if (!valid_flag) return false;

    var validated_proxy = {
        "ip": proxy.ip.value,
        "port": proxy.port.value,
        "username": proxy.username.value,
        "password": proxy.password.value
    };

    return validated_proxy;
}

function enableSite(){
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        var currentTab = tabs[0];
        var url = new URL(currentTab.url);
        var domain = url.hostname;
        var domain_splitted = domain.split(".")
        var domain = domain_splitted.pop()
        var domain = "." + domain_splitted.pop() + "." + domain
        chrome.runtime.sendMessage({ action: 'enableSite', domain: domain });
    });
}

function disableSite(){
    var proxy = chrome.storage.sync.get('proxy');

    if (!proxy) return;
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        var currentTab = tabs[0];
        var url = new URL(currentTab.url);
        var domain = url.hostname;
        var domain_splitted = domain.split(".")
        var domain = domain_splitted.pop()
        var domain = "." + domain_splitted.pop() + "." + domain
        chrome.runtime.sendMessage({ action: 'disableSite', domain: domain });
    });
}

window.enableSite = enableSite;
window.disableSite = disableSite;