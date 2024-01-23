function provideCredentials(requestDetails, callback) {
    chrome.storage.sync.get('proxy', function(data) {
        if (data && data.proxy) {
            var credentials = {
                username: data.proxy.username,
                password: data.proxy.password
            };
            callback({ authCredentials: credentials });
        } else {
            callback({});
        }
    });
}

chrome.webRequest.onAuthRequired.addListener(
    provideCredentials,
    { urls: ["<all_urls>"] },
    ["blocking"],
);


chrome.runtime.onMessage.addListener(
    async function(request, sender, semdResponse) {
        if (request.action == 'applyProxy') {
            await applyProxy(request.proxy);
        }
        else if (request.action == 'enableSite') {
            await enableSite(request.domain);
        }
        else if (request.action == 'disableSite'){
            await disableSite(request.domain);
        }
    }
);

async function applyProxy(proxy) {
    await chrome.storage.sync.set({ 'proxy': proxy });
}

async function enableSite(domain) {
    var proxy = await chrome.storage.sync.get("proxy");

    if (!proxy){
        return;
    }

    var domain_list = await chrome.storage.sync.get("domain_list");

    if (domain_list){
        domain_list = domain_list.domain_list
    }

    if (Array.isArray(domain_list)){
        domain_list.push(domain);
    }
    else{
        domain_list = new Array(domain);
    }
    await chrome.storage.sync.set({"domain_list": domain_list});
    await updateProxy(domain_list);
    
}

async function updateProxy(domain_list){
    var proxy = await chrome.storage.sync.get("proxy");
    var str_domain_list = "var domain_list = new Array(";
    for(let i=0; i<domain_list.length;i++){
        if (i != domain_list.length - 1){
            str_domain_list = str_domain_list + `"${domain_list[i]}",`;
        }
        else{
            str_domain_list = str_domain_list + `"${domain_list[i]}"`;
        }
    }
    str_domain_list = str_domain_list + ");"
    var config = {
        mode: "pac_script",
        pacScript: {
            data: "function FindProxyForURL(url, host) {\n" +
                    `${str_domain_list};\n` +
                    "for(var i=0; i<domain_list.length; i++) {\n" + 
                    "var value = domain_list[i];\n" +
                    ` if (dnsDomainIs(host, domain_list[i]))\n` + 
                        `return 'PROXY ${proxy.proxy.ip}:${proxy.proxy.port}';\n` +
                    "}\n" + 
                "  return 'DIRECT';\n" +
                "}"
        }
    };
    chrome.proxy.settings.set({ value: config, scope: 'regular' }, function() {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            console.log("Proxy settings applied successfully.");
        }
    });
}

async function disableSite(domain) {
    var domain_list = await chrome.storage.sync.get("domain_list");
    
    if (!domain_list) {
        return;
    }
    domain_list = domain_list.domain_list
    if (!Array.isArray(domain_list)){
        return;
    }
    
    var index = domain_list.indexOf(domain);
    if (index !== -1) {
        domain_list.splice(index, 1);
    }

    await chrome.storage.sync.set({"domain_list": domain_list})
    await updateProxy(domain_list);
}