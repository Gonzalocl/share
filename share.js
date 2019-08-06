

function loop () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            document.getElementById('img_show').innerHTML = this.responseText;
        }
    };
    request.open("POST", "share_list_files", true);
    var req_data = {};
    req_data.dir = "/";
    req_data.thumbnail = true;
    request.send(JSON.stringify(req_data));
}


setTimeout(loop, 1000);

