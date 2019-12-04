var updateDnsFlusherStatusUI = function(pageJson) {
  var page = JSON.parse(pageJson);

  var element = document.getElementById("dns_flusher_page_status");
  if (!(typeof element != "undefined" && element != null)) {
    var div = document.createElement("div");
    div.id = "dns_flusher_page_status";

    var div_dismiss = document.createElement("div");
    div_dismiss.className = "dismiss";
    div_dismiss.innerHTML = '<a href="#">&times;</a>';

    var div_info = document.createElement("div");
    div_info.className = "info";

    var div_ip = document.createElement("div");
    div_ip.className = "ip";
    div_instance = document.createElement("div");
    div_instance.className = "instance";
    div_php_version = document.createElement("div");
    div_php_version.className = "php_version";
    div_proxy_cache = document.createElement("div");
    div_proxy_cache.className = "proxy_cache";

    div_info.appendChild(div_ip);
    div_info.appendChild(div_instance);
    div_info.appendChild(div_php_version);
    div_info.appendChild(div_proxy_cache);
    div.appendChild(div_dismiss);
    div.appendChild(div_info);
    document.body.appendChild(div);

    document.querySelector("#dns_flusher_page_status .ip").innerText = page.ip;
    document.querySelector("#dns_flusher_page_status .instance").innerText =
      page.instanceName;
    document.querySelector("#dns_flusher_page_status .php_version").innerText =
      page.phpVersion == "" ? "" : "PHP " + page.phpVersion;
    document.querySelector("#dns_flusher_page_status .proxy_cache").innerText =
      page.proxyCache == "" ? "" : "Cache " + page.proxyCache;

    document.querySelector("#dns_flusher_page_status a").addEventListener(
      "click",
      function(event) {
        event.preventDefault();
        var elem = document.querySelector("#dns_flusher_page_status");
        elem.parentNode.removeChild(elem);

        chrome.runtime.sendMessage({action: "dismiss"}, function(response) {
          //console.log(response);
        });
      },
      false
    );

    /**
     * Makes an element draggable.
     *
     * https://jsfiddle.net/remarkablemark/93gfvjmw/
     *
     * @param {HTMLElement} element - The element.
     */
    function draggable(element) {
      var isMouseDown = false;

      // initial mouse X and Y for `mousedown`
      var mouseX;
      var mouseY;

      // https://gist.github.com/joshcarr/2f861bd37c3d0df40b30
      var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName("body")[0],
        windowWidth = w.innerWidth || e.clientWidth || g.clientWidth,
        windowHeight = w.innerHeight || e.clientHeight || g.clientHeight;

      // element X and Y before and after move
      var elementX = windowWidth - 5 - 150;
      var elementY = 5;

      // mouse button down over the element
      element.addEventListener("mousedown", onMouseDown);

      /**
       * Listens to `mousedown` event.
       *
       * @param {Object} event - The event.
       */
      function onMouseDown(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        isMouseDown = true;
      }

      // mouse button released
      element.addEventListener("mouseup", onMouseUp);

      /**
       * Listens to `mouseup` event.
       *
       * @param {Object} event - The event.
       */
      function onMouseUp(event) {
        isMouseDown = false;
        elementX = parseInt(element.style.left) || 0;
        elementY = parseInt(element.style.top) || 0;
      }

      // need to attach to the entire document
      // in order to take full width and height
      // this ensures the element keeps up with the mouse
      document.addEventListener("mousemove", onMouseMove);

      /**
       * Listens to `mousemove` event.
       *
       * @param {Object} event - The event.
       */
      function onMouseMove(event) {
        if (!isMouseDown) return;
        var deltaX = event.clientX - mouseX;
        var deltaY = event.clientY - mouseY;
        element.style.left = elementX + deltaX + "px";
        element.style.top = elementY + deltaY + "px";
      }
    }

    draggable(div);
  }
};
