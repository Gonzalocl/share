

var timeout_seconds = 3;

var img_index;
var img_list;
var img_dirname;
var img_show0;

function folder_click(dirname, filename) {
    if (dirname == "/") {
        show_dir("/" + filename);
    } else {
        show_dir(dirname + "/" + filename);
    }
}

function img_file_click(dirname, img_i) {
    img_index = img_i;
    show_img_file(dirname + "/" + img_list[img_index], dirname + "/" + img_list[(img_index + 1) % img_list.length]);
}

function vid_file_click(dirname, filename) {
    show_vid_file(dirname + "/" + filename);
}

function show_dir(path) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            data.list.sort(function (a, b) {
                if (a.type == b.type) {
                    if (a.path < b.path) {
                        return -1;
                    } else {
                        return 1;
                    }
                } else if (a.type < b.type) {
                    return -1;
                } else {
                    return 1;
                }
            });

            var img_show_div = document.getElementById('img_show');
            img_show_div.style.display = "none";

            var select_div = document.getElementById('select');
            select_div.innerHTML = "";

            document.getElementById("controls").style.display = "block";

            img_list = [];
            img_dirname = path;
            for (d in data.list) {

                var item_div = document.createElement("div");
                item_div.className = "item";
                select_div.appendChild(item_div);

                if (data.list[d].thumbnail != "") {
                    var thumbnail_img = document.createElement("img");
                    thumbnail_img.setAttribute("src", encodeURIComponent(data.list[d].thumbnail.slice(1)));
                    thumbnail_img.className = "thumbnail"
                    item_div.appendChild(thumbnail_img);
                }

                var name_div = document.createElement("div");
//                name_div.className = "marquee";
                name_div.className = "item_name";
                name_div.innerHTML = data.list[d].path;
                item_div.appendChild(name_div);

                if (data.list[d].type == "00_folder") {
                    item_div.setAttribute("onClick", 'folder_click("' + path + '", "' + data.list[d].path + '")');
                } else if (data.list[d].type == "01_img_file") {
                    item_div.setAttribute("onClick", 'img_file_click("' + path + '", ' + (img_list.push(data.list[d].path)-1) + ')');
                } else if (data.list[d].type == "02_vid_file") {
                    item_div.setAttribute("onClick", 'vid_file_click("' + path + '", "' + data.list[d].path + '")');
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
    full_screen_off();
}

function show_img_file(path0, path1) {
    var select_div = document.getElementById('select');
    select_div.innerHTML = "";

    var img_show_div = document.getElementById('img_show');
    img_show_div.style.display = "block";

    document.getElementById("controls").style.display = "none";

    var img_file0 = document.getElementById('img_show0');
    img_file0.className = "img_show";
    img_file0.src = encodeURIComponent(path0.slice(1));
    img_file0.style.display = "block";

    var img_file1 = document.getElementById('img_show1');
    img_file1.className = "img_show";
    img_file1.src = encodeURIComponent(path1.slice(1));
    img_file1.style.display = "none";

    img_show0 = true;
    img_index++;

    document.getElementById('full_dirname').innerHTML = path0;
    set_gestures();
    full_screen_on();
}

function show_vid_file(path) {
    var select_div = document.getElementById('select');
    select_div.innerHTML = "";

    var img_show_div = document.getElementById('img_show');
    img_show_div.style.display = "none";

    document.getElementById("controls").style.display = "none";

    var vid_file = document.createElement("video");
    vid_file.className = "vid_show";
    vid_file.setAttribute("src", encodeURIComponent(path.slice(1)));
    vid_file.setAttribute("controls", true);
    vid_file.setAttribute("autoplay", true);
    img_show_div.appendChild(vid_file);

    document.getElementById('full_dirname').innerHTML = path;
    set_gestures();
    full_screen_on();
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

// TODO fix bug inertia?
function next_img() {
    img_index = (img_index + 1) % img_list.length;
    if (img_show0) {
        var img_file0 = document.getElementById('img_show0');
        img_file0.style.display = "none";
        img_file0.src = encodeURIComponent((img_dirname + "/" + img_list[img_index]).slice(1));
        // TODO set onload

        var img_file1 = document.getElementById('img_show1');
        img_file1.style.display = "block";
    } else {
        var img_file1 = document.getElementById('img_show1');
        img_file1.style.display = "none";
        img_file1.src = encodeURIComponent((img_dirname + "/" + img_list[img_index]).slice(1));
        // TODO set onload

        var img_file0 = document.getElementById('img_show0');
        img_file0.style.display = "block";
    }
    img_show0 = !img_show0;
}

function prev_img() {
    img_index = (img_index - 1 + img_list.length) % img_list.length;
    if (img_show0) {
        var img_file0 = document.getElementById('img_show0');
        img_file0.style.display = "none";
        img_file0.src = encodeURIComponent((img_dirname + "/" + img_list[img_index]).slice(1));
        // TODO set onload

        var img_file1 = document.getElementById('img_show1');
        img_file1.style.display = "block";
    } else {
        var img_file1 = document.getElementById('img_show1');
        img_file1.style.display = "none";
        img_file1.src = encodeURIComponent((img_dirname + "/" + img_list[img_index]).slice(1));
        // TODO set onload

        var img_file0 = document.getElementById('img_show0');
        img_file0.style.display = "block";
    }
    img_show0 = !img_show0;
}

var playing = false;

function img_show_playing() {
    if (playing) {
        next_img();
        setTimeout(img_show_playing, timeout_seconds*1000);
    }
}

function img_show_play() {
    playing = true;
    setTimeout(img_show_playing, timeout_seconds*1000);
}

function img_show_pause() {
    playing = false;
}

function img_show_play_pause() {
    if (playing) {
        img_show_pause();
    } else {
        img_show_play();
    }
}

function full_screen_on() {
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

function full_screen_off() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function full_screen() {
    if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    ) {
        full_screen_off();
    } else {
        full_screen_on();
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
var end_x;
var end_y;

gesture_lay.ontouchstart = function (e) {
    start_x = e.touches[0].clientX;
    start_y = e.touches[0].clientY;
    end_x = e.touches[0].clientX;
    end_y = e.touches[0].clientY;
};

gesture_lay.ontouchmove = function (e) {
    end_x = e.touches[0].clientX;
    end_y = e.touches[0].clientY;
};

gesture_lay.ontouchend = function (e) {
    var difference_x = Math.abs(start_x - end_x);
    var difference_y = Math.abs(start_y - end_y);
    if (difference_x < click_threshold && difference_y < click_threshold) {
        if (start_x < window.innerWidth/3) {
            console.log("click l");
//            alert("click l");
            img_show_pause();
            prev_img();
        } else if (start_x > window.innerWidth/3*2) {
            console.log("click r");
//            alert("click r");
            img_show_pause();
            next_img();
        } else {
            console.log("click c");
//            alert("click c");
            img_show_play_pause();
        }
    } else if (Math.abs(difference_x - difference_y) > swipe_threshold) {
        if (difference_x < difference_y) {
            if (start_y < end_y) {
                console.log("swipe d");
//                alert("swipe d");
                img_show_pause();
                parent_folder();
            } else {
                console.log("swipe u");
//                alert("swipe u");
                img_show_pause();
                parent_folder();
            }
        } else {
            if (start_x < end_x) {
                console.log("swipe r");
//                alert("swipe r");
                img_show_pause();
                prev_img();
            } else {
                console.log("swipe l");
//                alert("swipe l");
                img_show_pause();
                next_img();
            }
        }
    } else {
        img_show_pause();
        console.log("gesture unrecognised");
//        alert("gesture unrecognised");
    }
};

document.onkeydown = function(e) {
//    console.log(e.key);
    if (e.key == "Escape") {
        parent_folder();
    } else if (e.key == "ArrowRight") {
        next_img();
    } else if (e.key == "ArrowLeft") {
        prev_img();
    }
}

