

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

            var img_show_div = document.getElementById('img_show');
            img_show_div.innerHTML = "";

            var select_div = document.getElementById('select');
            select_div.innerHTML = "";

            document.getElementById("controls").style.display = "block";

            for (d in data.list) {

                var item_div = document.createElement("div");
                item_div.className = "item";
                select_div.appendChild(item_div);

                if (data.list[d].thumbnail != "") {
                    var thumbnail_img = document.createElement("img");
                    thumbnail_img.setAttribute("src", encodeURI(data.list[d].thumbnail));
                    thumbnail_img.className = "thumbnail"
                    item_div.appendChild(thumbnail_img);
                }

                var name_div = document.createElement("div");
//                name_div.className = "marquee";
                name_div.className = "item_name";
                name_div.innerHTML = data.list[d].path;
                item_div.appendChild(name_div);


                if (data.list[d].type == "folder") {
                    item_div.setAttribute("onClick", 'folder_click("' + path + '", "' + data.list[d].path + '")');
                } else if (data.list[d].type == "img_file") {
                    item_div.setAttribute("onClick", 'img_file_click("' + path + '", "' + data.list[d].path + '")');
                }
            }
            document.getElementById('full_dirname').innerHTML = path;
            unset_gestures();
        }
    };
    request.open("POST", "share_list_files", true);
    var req_data = {};
    req_data.dir = path;
    // TODO response is different if this is false
    req_data.thumbnail = true;
    request.send(JSON.stringify(req_data));
}

function show_img_file(path) {
    var select_div = document.getElementById('select');
    select_div.innerHTML = "";

    var img_show_div = document.getElementById('img_show');
    img_show_div.innerHTML = "";

    document.getElementById("controls").style.display = "none";

    var img_file = document.createElement("img");
    img_file.className = "img_show";
    img_file.setAttribute("src", encodeURI(path));
    img_show_div.appendChild(img_file);

    document.getElementById('full_dirname').innerHTML = path;
    set_gestures();
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

// from
// https://stackoverflow.com/questions/7130397/how-do-i-make-a-div-full-screen
document.getElementById("full_screen").onclick = full_screen;
function full_screen() {
  // if already full screen; exit
  // else go fullscreen
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  ) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else {
    var element = document.getElementsByTagName('body')[0];
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }
};


/*
1 tap center  : play/pause
2 tap         : toggle full screen
1 tap R/L     : next/prev
swipe R/L     : next/prev
swipe up      : toggle full screen
swipe down    : parent folder
*/

function set_gestures() {
    var gesture_lay = document.getElementById('gesture_lay');
    gesture_lay.style.display = "block";
}

function unset_gestures() {
    var gesture_lay = document.getElementById('gesture_lay');
    gesture_lay.style.display = "none";
}

var gesture_lay = document.getElementById('gesture_lay');

// TODO make this window size dependent
var click_threshold = 20;
var swipe_threshold = 50;

var start_x;
var start_y;

gesture_lay.onmousedown = function (e) {
    start_x = e.clientX;
    start_y = e.clientY;
};

gesture_lay.onmouseup = function (e) {
    var difference_x = Math.abs(start_x - e.clientX);
    var difference_y = Math.abs(start_y - e.clientY);
    if (difference_x < click_threshold && difference_y < click_threshold) {
        console.log("click " + window.innerWidth);
    } else if (Math.abs(difference_x - difference_y) > swipe_threshold) {
        if (difference_x < difference_y) {
            if (start_y < e.clientY) {
                parent_folder();
            } else {
                full_screen()
            }
        } else {
            if (start_x < e.clientX) {
                console.log("swipe l");
            } else {
                console.log("swipe r");
            }
        }
    } else {
        console.log("gesture unrecognised");
    }
};
