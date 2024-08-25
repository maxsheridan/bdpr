document.addEventListener("DOMContentLoaded", function() {
    let col2ContentLoaded = false;

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
                    col2.classList.add("sticky");  // Apply sticky class
                    col2ContentLoaded = true;
                    reattachAjaxLinkListeners();
                })
                .catch(error => console.error('Error fetching the content:', error));
        }
    }

    loadCol2Content();

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
                window.scrollTo(0, 0);
                document.title = newTitle;

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

                reattachAjaxLinkListeners();
                updateActiveLink();

                // Apply the post class conditionally
                const mainTag = document.querySelector('main');
                if (url.includes("/post/")) { // Adjust this condition to fit your URL structure
                    mainTag.classList.add('post');
                    mainTag.style.marginTop = "3px";  // Apply 3px top margin
                } else {
                    mainTag.classList.remove('post');
                    mainTag.style.marginTop = "0";  // Reset margin
                }
            })
            .catch(error => console.error('Error fetching the page content:', error));
    }

    function reattachAjaxLinkListeners() {
        document.querySelectorAll('.ajax-link').forEach(link => {
            link.removeEventListener('click', ajaxLinkClickHandler);
            link.addEventListener('click', ajaxLinkClickHandler);
        });
    }

    function ajaxLinkClickHandler(event) {
        event.preventDefault();
        const url = this.getAttribute('href');
        history.pushState(null, '', url);
        loadContent(url);
    }

    function updateActiveLink() {
        const links = document.querySelectorAll("nav .links a");
        const currentPath = window.location.pathname;

        links.forEach(link => {
            link.classList.remove('active');
            if (currentPath === link.getAttribute("href")) {
                link.classList.add('active');
            }
        });
    }

    reattachAjaxLinkListeners();
    updateActiveLink();

    window.addEventListener('popstate', function() {
        loadContent(location.pathname);
    });

    // Initial check for the post class on page load
    const initialUrl = window.location.pathname;
    const mainTag = document.querySelector('main');
    if (initialUrl.includes("/post/")) { // Adjust this condition to fit your URL structure
        mainTag.classList.add('post');
        mainTag.style.marginTop = "3px";
    } else {
        mainTag.classList.remove('post');
        mainTag.style.marginTop = "0";
    }
});