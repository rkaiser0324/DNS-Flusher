var updateDnsFlusherStatusUI = function(pageJson) {
  var page = JSON.parse(pageJson);

  var div = document.createElement("div");
  div.id = "dns_flusher_page_status";

  var div_left = document.createElement("div");
  div_left.className = "left";
  div_left.innerHTML = '<div> &harr; </div>';

  var div_right = document.createElement("div");
  div_right.className = "right";

  var div_ip = document.createElement("div");
  div_ip.className = "ip";
  div_instance = document.createElement("div");
  div_instance.className = "instance";
  div_php_version = document.createElement("div");
  div_php_version.className = "php_version";

  div_right.appendChild(div_ip);
  div_right.appendChild(div_instance);
  div_right.appendChild(div_php_version);
  div.appendChild(div_left);
  div.appendChild(div_right);
  document.body.appendChild(div);

  document.querySelector("#dns_flusher_page_status .ip").innerText = page.ip;
  document.querySelector("#dns_flusher_page_status .instance").innerText =
    page.instanceName;
  document.querySelector("#dns_flusher_page_status .php_version").innerText =
    page.phpVersion == "" ? "" : "PHP " + page.phpVersion;

  div.addEventListener(
    "click",
    function(event) {
      event.preventDefault();

      var d = document.getElementById("dns_flusher_page_status");
      if (hasClass(d, "offscreen")) {
        d.style.right = "5px";
        removeClass(d, "offscreen");
      } else {
        var buttonWidth = document.querySelector("#dns_flusher_page_status .left").offsetWidth;
        d.style.right = -(d.offsetWidth - buttonWidth - 10) + "px";
        addClass(d, "offscreen");
      }
    },
    false
  );

  // Helper functions from https://stackoverflow.com/a/28344281 and http://jaketrent.com/post/addremove-classes-raw-javascript/
  function hasClass(ele, cls) {
    return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
  }

  function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += " " + cls;
  }

  function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
      var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
      ele.className = ele.className.replace(reg, " ");
    }
  }
};
