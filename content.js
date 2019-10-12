var updateUI = function(ip, instance) {

  var div = document.createElement('div');
  div.id = "chrome_websiteIP";

  var div_ip = document.createElement('div');
  div_ip.innerText = ip;

  var div_instance = document.createElement('div');
  div_instance.innerText = instance;

  div.appendChild(div_ip);
  div.appendChild(div_instance);

  document.body.appendChild(div);
}