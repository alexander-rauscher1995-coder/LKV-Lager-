/* Public runtime configuration. Server secrets are never stored here. */
window.FITNESS_CLOUD_CONFIG={
  enabled:true,
  apiBaseUrl:'/api'
};

/* Load the calculator experience layer without exposing server secrets. */
(function(){
  var s=document.createElement('script');
  s.src='./calculator-pro.js?v=162';
  s.defer=true;
  document.head.appendChild(s);
})();