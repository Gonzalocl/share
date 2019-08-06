

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
    req_data.method = "listt";
    req_data.dir = "one";
    req_data.arr = [];
    req_data.arr[0] = "zero";
    req_data.arr[1] = "one";
    req_data.arr[2] = "two";
    request.send(JSON.stringify(req_data));
}


setTimeout(loop, 1000);

