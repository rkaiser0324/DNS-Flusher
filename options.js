(function () {

  if (!chrome.benchmarking) {
    location.href = 'https://goo.gl/vSh9im';
  }

  const options = {
    interval: (localStorage.getItem('auto.refresh.interval') || 0) / 1,
    delete_domain_cookies: (localStorage.getItem('delete_domain_cookies') || 0) / 1,
  };

  const interval = document.getElementById('interval');
  interval.value = options.interval;
  interval.addEventListener('input', e => {
    const value = e.target.value;
    options.interval = value;
    localStorage.setItem('auto.refresh.interval', value);
  });

  const delete_domain_cookies = document.getElementById('delete_domain_cookies');
  delete_domain_cookies.value = options.delete_domain_cookies;
  delete_domain_cookies.addEventListener('input', e => {
    const value = e.target.value;
    options.delete_domain_cookies = value;
    localStorage.setItem('delete_domain_cookies', value);
  });

})();