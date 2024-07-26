document.addEventListener("DOMContentLoaded", () => {
    const linksSelector = "nav .links a";  // Selector for navigation links

    // Function to update active link
    function updateActiveLink() {
        const links = document.querySelectorAll(linksSelector);
        const currentPath = window.location.pathname;
        
        links.forEach(link => {
            link.classList.remove('active');
            const linkPath = link.getAttribute("href");

            if (currentPath === linkPath) {
                link.classList.add('active');
            }
        });
    }

    // Call the function to update the active link
    updateActiveLink();
});