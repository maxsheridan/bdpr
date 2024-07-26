document.addEventListener('DOMContentLoaded', function() {
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
});

function updateHeaderHeight() {
    var header = document.querySelector('header');
    var root = document.documentElement;
    var headerHeight = header.offsetHeight + 'px';
    root.style.setProperty('--header-height', headerHeight);
}