document.addEventListener('DOMContentLoaded', function() {
    getProxyData();
    checkIfSiteAdded();
    loadTabs();
});

function loadTabs(){
    const tabs1 = new GraphTabs('tab');
}

function checkIfSiteAdded(){
    var elementToStart = document.getElementById("siteEnabling");
    chrome.storage.sync.get('domain_list', function(domain_list){
        if (!domain_list.domain_list){
            elementToStart.innerHTML += '<button id="enableSite">Enable on this site</button>';
            document.getElementById("enableSite").addEventListener("click", enableSite);
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

                elementToStart.innerHTML += '<button id="enableSite">Enable on this site</button>';
                document.getElementById("enableSite").addEventListener("click", enableSite);
                return;
            }

            elementToStart.innerHTML += '<button id="disableSite">Disable on this site</button>';
            document.getElementById('disableSite').addEventListener("click", disableSite);
        });
    });
}

function getProxyData() {
    var proxyDataElement = document.getElementById('proxyData');
    chrome.storage.sync.get("proxy", function(data){
        if (data.proxy){
            var html_to_add = `<p class="fs-6 fw-normal mb-1">Ip: ${data.proxy.ip}</p>\n`+
                        `<p class="fs-6 fw-normal mb-1">Port: ${data.proxy.port}</p>\n`+
                        `<p class="fs-6 fw-normal mb-1">Username: ${data.proxy.username}</p>\n`+
                        `<p class="fs-6 fw-normal mb-1">Password: ${data.proxy.password}</p>\n`+
                        `<button id="changeProxy" type="button" class="btn btn-outline-primary">Change proxy</button>`;
            proxyDataElement.innerHTML += html_to_add;
            document.getElementById("changeProxy").addEventListener("click", changeProxy);
        }
        else{
            var html_to_add = `<h2>Proxy adding</h2>\n

                <input type="text" id="proxyIP" placeholder="IP">\n

                <input type="text" id="proxyPort" placeholder="Port">\n

                <input type="text" id="proxyUsername" placeholder="Login">\n
                
                <input type="text" id="proxyPassword" placeholder="Password">\n

                <button id="applyProxy" type="button" class="btn btn-primary">Apply Proxy</button>\n
                <p>Or you can visit this site <a href="proxy6.net/user/proxy">proxy6.net</a>\n
                If you have proxy there, push button below</p>\n
                <button id="autoDetectProxy">Auto detect</button>`;
            proxyDataElement.innerHTML += html_to_add;
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