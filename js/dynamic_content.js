document.addEventListener("DOMContentLoaded", function() {
    // Flag to check if col-2 content is already loaded
    let col2ContentLoaded = false;

    // Function to load col-2 content initially
    function loadCol2Content() {
        if (!col2ContentLoaded) {
            fetch("/dynamic_content.html")
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    const col2 = document.querySelector(".col-2");
                    col2.innerHTML = data;

                    col2ContentLoaded = true; // Set flag to true after loading content
                    
                    // Reattach event listeners to links in col-2 content
                    reattachAjaxLinkListeners();
                })
                .catch(error => console.error('Error fetching the content:', error));
        }
    }

    // Load col-2 content on initial page load
    loadCol2Content();

    // Function to load content via AJAX and update the title and meta description
    function loadContent(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const newContent = doc.querySelector('#content').innerHTML;
                const newTitle = doc.querySelector('title').innerText;
                const newDescription = doc.querySelector('meta[name="description"]');

                // Update the main content
                document.querySelector('#content').innerHTML = newContent;
                
                // Scroll to the top of the page
                window.scrollTo(0, 0);
                
                // Update the document title
                document.title = newTitle;

                // Update the meta description if available
                if (newDescription) {
                    const currentDescription = document.querySelector('meta[name="description"]');
                    if (currentDescription) {
                        currentDescription.setAttribute('content', newDescription.getAttribute('content'));
                    } else {
                        const meta = document.createElement('meta');
                        meta.name = "description";
                        meta.content = newDescription.getAttribute('content');
                        document.head.appendChild(meta);
                    }
                }

                // Reattach event listeners to new AJAX links in the updated content
                reattachAjaxLinkListeners();

                // Update active link styling
                updateActiveLink();
            })
            .catch(error => console.error('Error fetching the page content:', error));
    }

    // Function to attach click event to AJAX links
    function reattachAjaxLinkListeners() {
        document.querySelectorAll('.ajax-link').forEach(link => {
            // Remove existing event listeners to avoid duplication
            link.removeEventListener('click', ajaxLinkClickHandler);
            // Attach new event listener
            link.addEventListener('click', ajaxLinkClickHandler);
        });
    }

    // Click handler for AJAX links
    function ajaxLinkClickHandler(event) {
        event.preventDefault();
        const url = this.getAttribute('href');
        history.pushState(null, '', url);
        loadContent(url);
    }

    // Function to update active link styling
    function updateActiveLink() {
        const linksSelector = "nav .links a";  // Selector for navigation links
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

    // Initial attachment of AJAX link listeners and update active link styling
    reattachAjaxLinkListeners();
    updateActiveLink();

    // Handle back/forward navigation
    window.addEventListener('popstate', function() {
        loadContent(location.pathname);
    });
});