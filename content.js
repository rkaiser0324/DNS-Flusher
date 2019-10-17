var updateDnsFlusherStatusUI = function(pageJson) {
  var page = JSON.parse(pageJson);

  var div = document.createElement("div");
  div.id = "dns_flusher_page_status";

  var div_x = document.createElement("div");
  div_x.className = "x";
  div_x.innerHTML = '<a href="">&times;</a>';

  var div_ip = document.createElement("div");
  div_ip.className = "ip";
  div_instance = document.createElement("div");
  div_instance.className = "instance";
  div_php_version = document.createElement("div");
  div_php_version.className = "php_version";

  div.appendChild(div_x);
  div.appendChild(div_ip);
  div.appendChild(div_instance);
  div.appendChild(div_php_version);
  document.body.appendChild(div);

  document.querySelector("#dns_flusher_page_status .ip").innerText = page.ip;
  document.querySelector("#dns_flusher_page_status .instance").innerText =
    page.instanceName;
  document.querySelector("#dns_flusher_page_status .php_version").innerText =
    page.phpVersion == "" ? "" : "PHP " + page.phpVersion;

  document.addEventListener(
    "click",
    function(event) {
      // If the clicked element doesn't have the right selector, bail
      if (event.target.matches("#dns_flusher_page_status a")) {
        // Don't follow the link
        event.preventDefault();
        document.querySelector("#dns_flusher_page_status").style.display = "none";
      }
    },
    false
  );
};
