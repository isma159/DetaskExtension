document.addEventListener('DOMContentLoaded', () => {
    const loginView = document.getElementById('login-view');
    const mainView = document.getElementById('main-view');

    // Login elements
    const signInBtn = document.getElementById("signInBtn");
    const signInUserField = document.getElementById("signInUserField");
    const signInPassField = document.getElementById("signInPassField");
    const MOCK_USER = "worker";
    const MOCK_PASS = "worker123";

    // Tab elements (from main_page.js)
    let tabButtons;
    let tabContents;

    // Function to initialize tab functionality
    const initializeTabs = () => {
        tabButtons = document.querySelectorAll('.tab-button');
        tabContents = document.querySelectorAll('.tab-content');

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
    };

    signInBtn.addEventListener('click', () => {
        if (signInUserField.value === MOCK_USER && signInPassField.value === MOCK_PASS) {
            console.log("LOGGED IN");
            loginView.classList.add('hidden');
            mainView.classList.remove('hidden');
            initializeTabs(); // Initialize tabs after showing the main view
        } else {
            console.log("INCORRECT CREDENTIALS");
            // Optionally, add an error message display here
        }
    });
});