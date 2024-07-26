document.addEventListener('DOMContentLoaded', function() {
    var header = document.querySelector('header');
    var root = document.documentElement;
    var headerHeight = header.offsetHeight + 'px';
    root.style.setProperty('--header-height', headerHeight);
});