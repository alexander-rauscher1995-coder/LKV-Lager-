/* Public runtime configuration. Server secrets are never stored here. */
window.FITNESS_CLOUD_CONFIG={
  enabled:true,
  apiBaseUrl:'/api'
};

(function(){
  ['calculator-pro.js?v=163','training-pro.js?v=1','nutrition-pro.js?v=1','progress-pro.js?v=1'].forEach(function(src){
    var s=document.createElement('script');
    s.src='./'+src;
    s.defer=true;
    document.head.appendChild(s);
  });
})();
