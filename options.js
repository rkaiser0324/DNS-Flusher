(function () {

  if (!chrome.benchmarking) {
    location.href = 'https://goo.gl/vSh9im';
  }

  const interval = document.getElementById('interval');

  const options = {
    interval: (localStorage.getItem('auto.refresh.interval') || 0) / 1,
  };

  interval.value = options.interval;

  interval.addEventListener('input', e => {
    const value = e.target.value;
    options.interval = value;
    localStorage.setItem('auto.refresh.interval', value);
  });

})();