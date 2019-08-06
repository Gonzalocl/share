

function loop () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            document.getElementById('img_show').innerHTML = data.name;
        }
    };
    request.open("GET", "demo.json", true);
    request.send();
}


setTimeout(loop, 1000);

