(function(){
  const C = window.CONFIG;
  // Apply theme from CONFIG
  document.documentElement.style.setProperty("--bg1", C.colors.backgroundStart);
  document.documentElement.style.setProperty("--bg2", C.colors.backgroundEnd);
  document.documentElement.style.setProperty("--btn", C.colors.buttonBackground);
  document.documentElement.style.setProperty("--btnHover", C.colors.buttonHover);
  document.documentElement.style.setProperty("--text", C.colors.textColor);

  // Page title
  document.title = C.pageTitle;
})();
