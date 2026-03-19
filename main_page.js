// main_page.js
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Function to set an active tab
    const setActiveTab = (button, content) => {
        // Deactivate all tabs and hide all content
        tabButtons.forEach(btn => {
            btn.classList.remove('bg-blue-100', 'text-blue-800');
            btn.classList.add('text-slate-600');
        });
        tabContents.forEach(cont => {
            cont.classList.add('hidden');
        });

        // Activate the selected tab and show its content
        button.classList.add('bg-blue-100', 'text-blue-800');
        button.classList.remove('text-slate-600');
        content.classList.remove('hidden');
    };

    // Set the first tab as active by default
    if (tabButtons.length > 0 && tabContents.length > 0) {
        setActiveTab(tabButtons[0], tabContents[0]);
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTabId = button.dataset.tab;
            const targetContent = document.getElementById(`${targetTabId}-content`);
            if (targetContent) {
                setActiveTab(button, targetContent);
            }
        });
    });
});