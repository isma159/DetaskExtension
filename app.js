document.addEventListener('DOMContentLoaded', () => {
    const signInBtn = document.getElementById('signInBtn');
    const loginView = document.getElementById('login-view');
    const mainView = document.getElementById('main-view');

    // Survey elements
    const surveyQuestionDisplay = document.getElementById('survey-question-display');
    const surveyOptionsContainer = document.getElementById('survey-options');
    const submitAnswerBtn = document.getElementById('submit-answer');
    const surveyResultDisplay = document.getElementById('survey-result');

    // Survey Progress Bar elements
    const surveyProgressText = document.getElementById('survey-progress-text');
    const surveyProgressBar = document.getElementById('survey-progress-bar');
    const dailySurveyStatus = document.getElementById('daily-survey-status');
    const surveyContainer = document.getElementById('survey-container'); // To hide/show the survey

    const surveyQuestions = [
        { question: "I feel energised and refreshed at the start of a workday.", scores: [1, 2, 3, 4, 5] },
        { question: "I find it easy to motivate myself to tackle my work tasks.", scores: [1, 2, 3, 4, 5] },
        { question: "I feel genuinely connected and engaged with my work and colleagues.", scores: [1, 2, 3, 4, 5] },
        { question: "I feel like my workload is manageable and under control.", scores: [1, 2, 3, 4, 5] },
        { question: "I feel like the work I do has real meaning and impact.", scores: [1, 2, 3, 4, 5] },
        { question: "I feel fully rested and recharged after time off or a weekend.", scores: [1, 2, 3, 4, 5] },
        { question: "I feel positive and enthusiastic about my job and workplace.", scores: [1, 2, 3, 4, 5] },
        { question: "I can concentrate and stay focused easily during work hours.", scores: [1, 2, 3, 4, 5] },
        { question: "I feel physically healthy — sleeping well and rarely getting ill.", scores: [1, 2, 3, 4, 5] },
        { question: "I look forward to going to work at the start of a new day.", scores: [1, 2, 3, 4, 5] }
    ];
    let currentQuestionIndex = 0;
    let totalScore = 0;
    let dailySurveyCompleted = false;

    // Simulate successful login for demonstration
    if (signInBtn) {
        signInBtn.addEventListener('click', () => {
            loginView.classList.add('hidden');
            mainView.classList.remove('hidden');
            displayQuestion();
            updateSurveyProgressBar(); // Initialize progress bar after login
        });
    }
    // Tab switching logic
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deactivate all tab buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('bg-blue-100', 'text-blue-800');
                btn.classList.add('text-slate-600', 'hover:bg-blue-50', 'hover:text-blue-700');
            });

            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });

            // Activate the clicked tab button
            button.classList.add('bg-blue-100', 'text-blue-800');
            button.classList.remove('text-slate-600', 'hover:bg-blue-50', 'hover:text-blue-700');

            // Show the corresponding tab content
            const targetTab = button.dataset.tab;
            const targetContent = document.getElementById(`${targetTab}-content`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
                /*if (targetTab === 'health') {
                    currentQuestionIndex = 0; // Reset survey
                    totalScore = 0;
                    surveyContainer.classList.remove('hidden');
                    dailySurveyCompleted = false; // Reset daily survey status
                    displayQuestion();
                    updateSurveyProgressBar(); // Update progress bar on tab switch
                } else {
                    surveyContainer.classList.add('hidden'); // Hide survey if not on health tab
                }*/
            }
        });
    });
    // Set initial active tab (e.g., Health tab)
    const initialTabButton = document.querySelector('.tab-button[data-tab="health"]');
    if (initialTabButton) {
        initialTabButton.click(); // Simulate a click to activate it
    }

    function displayQuestion() {
        if (currentQuestionIndex < surveyQuestions.length) {
            const questionData = surveyQuestions[currentQuestionIndex];
            surveyQuestionDisplay.textContent = questionData.question;
            surveyOptionsContainer.innerHTML = ''; // Clear previous options

            questionData.scores.forEach(score => {
                const radioDiv = document.createElement('div');
                radioDiv.className = 'flex items-center';

                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = 'health-score';
                radioInput.value = score;
                radioInput.id = `score-${score}`;
                radioInput.className = 'h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500'; // Tailwind classes for radio

                const radioLabel = document.createElement('label');
                radioLabel.htmlFor = `score-${score}`;
                radioLabel.className = 'ml-2 block text-sm font-medium text-gray-700';
                radioLabel.textContent = score;

                radioDiv.appendChild(radioInput);
                radioDiv.appendChild(radioLabel);
                surveyOptionsContainer.appendChild(radioDiv);
            });
            submitAnswerBtn.classList.remove('hidden');
            surveyResultDisplay.classList.add('hidden');
        } else {
            surveyQuestionDisplay.textContent = "Survey Complete!";
            surveyOptionsContainer.innerHTML = '';
            submitAnswerBtn.classList.add('hidden');
            surveyResultDisplay.classList.remove('hidden');
            surveyResultDisplay.textContent = `Total Health Score: ${totalScore}`;
            dailySurveyCompleted = true;
            console.log("Final Survey Score:", totalScore);
        }
    }

    function updateSurveyProgressBar() {
        const totalQuestions = surveyQuestions.length;
        const progress = (currentQuestionIndex / totalQuestions) * 100;
        surveyProgressText.textContent = `${Math.round(progress)}%`;
        surveyProgressBar.style.width = `${progress}%`;

        if (dailySurveyCompleted) {
            dailySurveyStatus.textContent = 'Completed';
            dailySurveyStatus.classList.remove('text-red-700');
            dailySurveyStatus.classList.add('text-green-700');
        } else {
            dailySurveyStatus.textContent = 'Not Taken';
            dailySurveyStatus.classList.remove('text-green-700');
            dailySurveyStatus.classList.add('text-red-700');
        }
    }

    submitAnswerBtn.addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="health-score"]:checked');
        if (selectedOption) {
            totalScore += parseInt(selectedOption.value, 10);
            currentQuestionIndex++;
            displayQuestion();
            updateSurveyProgressBar(); // Update progress bar after each answer
        } else {
            alert("Please select a score before submitting.");
        }
    });
});