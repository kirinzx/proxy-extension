import {regular_ip, proxyForm_html, getProxyDataHtml,disableSite_html,enableSite_html, getErrorHtml, non_clickable_html, getAutoDetectErrorHTML} from "./tools.js"

document.addEventListener('DOMContentLoaded', function() {
    getProxyData();
    checkIfSiteAdded();
});

function checkIfSiteAdded(){
    chrome.storage.sync.get(['domain_list',"proxy"], function(data){
        var is_clickable = true;
        if (!data.proxy){
            is_clickable = false;
        }
        if (!data.domain_list){
            renderEnableSiteHTML(is_clickable);
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

            if (data.domain_list.indexOf(domain) == -1){

                renderEnableSiteHTML(is_clickable);
                return;
            }

            renderDisableSiteHTML(is_clickable);
        });
    });
}

function getProxyData() {
    chrome.storage.sync.get("proxy", function(data){
        if (data.proxy){
            renderProxyDataHTML(data.proxy);
        }
        else{
            renderProxyFormHTML();
        }
    });
}


function changeProxy(){
    renderProxyFormHTML();
    deleteProxy();
    removeAllDomains();
    resetProxySettings();
}

function autoDetect(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 
                {
                    message: "autoDetect",
                }, function(response) {
                    if (response.data.errors.length != 0){
                        response.data.errors.forEach(element => {
                            renderAutoDetectError(element);
                        });
                        return;
                    }
                    fillProxyForm(response.data.proxy);
                }
            )
        }
    )
}

function applyProxy() {
    var proxy = {
        "ip": document.getElementById('proxyIP'),
        "port": document.getElementById('proxyPort'),
        "username": document.getElementById('proxyUsername'),
        "password": document.getElementById('proxyPassword')
    }
    var validatedData = validateProxy(proxy);

    if (validatedData == false){
        return;
    }
    proxy.ip.value = '';
    proxy.port.value = '';
    proxy.username.value = '';
    proxy.password.value = '';
    chrome.runtime.sendMessage({ action: 'applyProxy', proxy: validatedData });
    var element = document.getElementById("proxy_form_div");
    element.remove()  
    renderProxyDataHTML(validatedData);
    removeSiteEnablingError();
}

function deleteProxy(){
    chrome.storage.sync.set({"proxy": null});
}

function removeAllDomains(){
    chrome.storage.sync.set({"domain_list": []});
}

function resetProxySettings(){
    chrome.runtime.sendMessage({ action: 'resetProxy'});
}

function validateProxy(proxy){
    var valid_flag = true;

    if (!regular_ip.test(proxy.ip.value)){
        proxy.ip.classList.add("border-danger");
        valid_flag = false;
    }
    try{
        if (!proxy.port.value || 0 >= parseInt(proxy.port.value) ||  parseInt(proxy.port.value) >= 65535){
            proxy.port.classList.add("border-danger");
            valid_flag = false;
        }
    }
    catch (err){
        proxy.port.classList.add("border-danger");
        valid_flag = false;
    }
    
    if (!proxy.username.value){
        proxy.username.classList.add("border-danger");
        valid_flag = false;
    }
    if (!proxy.password.value){
        proxy.password.classList.add("border-danger");
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

function fillProxyForm(proxy){
    document.getElementById("proxyIP").value = proxy.ip;
    document.getElementById("proxyPort").value = proxy.port;
    document.getElementById("proxyUsername").value = proxy.username;
    document.getElementById("proxyPassword").value = proxy.password;
}


function renderAutoDetectError(errorText){
    var htmlToAdd = getAutoDetectErrorHTML(errorText);
    document.getElementById("auto-detect-span").insertAdjacentHTML("afterend",htmlToAdd);
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

function renderProxyDataHTML(proxy){
    var proxyDataElement = document.getElementById('proxy-data');
    proxyDataElement.replaceChildren()
    proxyDataElement.innerHTML += getProxyDataHtml(proxy);
    document.getElementById("changeProxy").addEventListener("click", changeProxy);
}

function renderProxyFormHTML(){
    var proxyDataElement = document.getElementById('proxy-data');
    proxyDataElement.replaceChildren()
    proxyDataElement.innerHTML += proxyForm_html;
    document.getElementById("applyProxy").addEventListener("click", applyProxy);
    document.getElementById("auto-detect-span").addEventListener("click", autoDetect);
}

function renderEnableSiteHTML(is_clickable){
    var elementToStart = document.getElementById("site-configuration");
    elementToStart.replaceChildren();
    elementToStart.innerHTML += enableSite_html;
    var button = document.getElementById("enableSite");
    button.addEventListener("click", enableSite)
    if (!is_clickable){
        button.classList.add("no-click");
        button.insertAdjacentHTML("beforebegin",non_clickable_html);
    }
}

function renderDisableSiteHTML(is_clickable){
    var elementToStart = document.getElementById("site-configuration");
    elementToStart.replaceChildren();
    elementToStart.innerHTML += disableSite_html;
    var button = document.getElementById("disableSite");
    button.addEventListener("click", disableSite)
    if (!is_clickable){
       button.classList.add("no-click");
       button.insertAdjacentHTML("beforebegin",non_clickable_html);
    }
}

function removeSiteEnablingError(){
    document.getElementById("site-enabling-error").remove()
}