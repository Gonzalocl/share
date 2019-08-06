

function show_dir (path) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            var select_div = document.getElementById('select');
            for (d in data.list) {
                var item_div = document.createElement("div");
                item_div.innerHTML = data.list[d].path;
                item_div.className = "item";
                select_div.appendChild(item_div);
                select_div.appendChild(document.createTextNode(" "));
            }
            document.getElementById('controls').innerHTML = path;
        }
    };
    request.open("POST", "share_list_files", true);
    var req_data = {};
    req_data.dir = path;
    req_data.thumbnail = true;
    request.send(JSON.stringify(req_data));
}


show_dir ("/links");
