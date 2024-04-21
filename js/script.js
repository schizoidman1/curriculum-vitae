document.addEventListener("DOMContentLoaded", function() {
    const anchorLinks = document.querySelectorAll('.side-menu a');
    const mainSection = document.querySelectorAll('.main-content');
    const skillsSection = document.querySelectorAll('.skills');
    const workSection = document.querySelectorAll('.work');
    const portfolioSection = document.querySelectorAll('.portfolio');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior

            // Hide all sections
            mainSection.forEach(section => {
                section.style.display = 'none';
            });
            skillsSection.forEach(section => {
                section.style.display = 'none';
            });
            workSection.forEach(section => {
                section.style.display = 'none';
            });
            portfolioSection.forEach(section => {
                section.style.display = 'none';
            });

            const targetSectionClass = this.getAttribute('href').substring(1); // Get the class of the target section

            // Show the target section by its class
            if (targetSectionClass === 'skills') {
                skillsSection.forEach(section => {
                    section.style.display = 'block';
                });
            } else if (targetSectionClass === 'work') {
                workSection.forEach(section => {
                    section.style.display = 'block';
                });
            } else if (targetSectionClass === 'portfolio') {
                portfolioSection.forEach(section => {
                    section.style.display = 'block';
                });
            } else {
                // Default to main section if no specific class matches
                mainSection.forEach(section => {
                    section.style.display = 'block';
                });
            }
        });
    });
});
