chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.message == "autoDetect") {
        var dataToResponse = autoDetectProxy();
        sendResponse({data:dataToResponse});
    }
    console.log(request)
})

function autoDetectProxy(){
    var ul_proxy_data = document.getElementsByClassName("list-dotted user_list_dotted");
    var dataToResponse = {
        proxy: {},
        errors: []
    }
    if (!ul_proxy_data) {
        dataToResponse.errors.push("Couldn't find proxy");
        return;
    }

    try{
        var li_list = ul_proxy_data[0].children;
        if (li_list.length < 3) {
            dataToResponse.errors.push("Invalid proxy data");
            return;
        }

        if (dataToResponse.errors.length != 0) return dataToResponse;

        for (var i = 0; i < 3; i++) {
            var element = li_list[i];
            var proxyData = element.innerText.split("\n")[1];
            if (i == 0) {
                proxyData = proxyData.split(":")
                dataToResponse.proxy.ip = proxyData[0];
                dataToResponse.proxy.port = proxyData[1];
            }
            else if (i == 1) {
                dataToResponse.proxy.username = proxyData;
            }
            else if (i == 2) {
                dataToResponse.proxy.password = proxyData;
            }
        }
    }
    catch(err){
        dataToResponse.errors.push("Invalid proxy data");
    }
    finally{
        return dataToResponse;
    }
}