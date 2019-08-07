

function un_click(dirname, filename) {
    show_dir(dirname + "/" + filename);
}

function show_dir (path) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            var select_div = document.getElementById('select');
            select_div.innerHTML = "";
            for (d in data.list) {

                var thumbnail_img = document.createElement("img");
                thumbnail_img.setAttribute("src", encodeURI(data.list[d].thumbnail));

                var name_div = document.createElement("div");
//                name_div.className = "marquee";
                name_div.className = "item_name";
                name_div.innerHTML = data.list[d].path;

                var item_div = document.createElement("div");
                item_div.className = "item";
                item_div.appendChild(thumbnail_img);
                item_div.appendChild(name_div);
                select_div.appendChild(item_div);

                item_div.setAttribute("onClick", 'un_click("' + path + '", "' + data.list[d].path + '")');
            }
            document.getElementById('full_dirname').innerHTML = path;
        }
    };
    request.open("POST", "share_list_files", true);
    var req_data = {};
    req_data.dir = path;
    // TODO response is different if this is false
    req_data.thumbnail = true;
    request.send(JSON.stringify(req_data));
}


show_dir ("/links");
