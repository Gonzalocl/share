

function folder_click(dirname, filename) {
    if (dirname == "/") {
        show_dir("/" + filename);
    } else {
        show_dir(dirname + "/" + filename);
    }
}

function img_file_click(dirname, filename) {
    show_img_file(dirname + "/" + filename);
}

function show_dir(path) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            var select_div = document.getElementById('select');
            select_div.innerHTML = "";
            for (d in data.list) {

                var thumbnail_img = document.createElement("img");
                thumbnail_img.setAttribute("src", encodeURI(data.list[d].thumbnail));
                thumbnail_img.className = "thumbnail"

                var name_div = document.createElement("div");
//                name_div.className = "marquee";
                name_div.className = "item_name";
                name_div.innerHTML = data.list[d].path;

                var item_div = document.createElement("div");
                item_div.className = "item";
                item_div.appendChild(thumbnail_img);
                item_div.appendChild(name_div);
                select_div.appendChild(item_div);

                if (data.list[d].type == "folder") {
                    item_div.setAttribute("onClick", 'folder_click("' + path + '", "' + data.list[d].path + '")');
                } else if (data.list[d].type == "img_file") {
                    item_div.setAttribute("onClick", 'img_file_click("' + path + '", "' + data.list[d].path + '")');
                }
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


show_dir("/links");


function parent_folder() {
    var path = document.getElementById('full_dirname').innerHTML;
    var split_path = path.split("/");
    var end = 1;
    if (split_path.length > 2) {
        end = (path.length - split_path[split_path.length-1].length)-1;
    }
    path = path.slice(0, end);
    show_dir(path);
}


