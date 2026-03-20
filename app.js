document.addEventListener('DOMContentLoaded', () => {
    const signInBtn = document.getElementById('signInBtn');
    const loginView = document.getElementById('login-view');
    const mainView = document.getElementById('main-view');
    const pointCounter = document.getElementById('point-counter');

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
    let scores = [];
    let totalScore = 0;
    let dailySurveyCompleted = false;

    // Simulate successful login for demonstration
    if (signInBtn) {
        signInBtn.addEventListener('click', () => {
            loginView.classList.add('hidden');
            mainView.classList.remove('hidden');
            displayQuestion();
            updateSurveyProgressBar(); // Initialize progress bar after login
            fetchTeamPoints(); // Fetch points after login
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

            // Activate the clicked tab button (using blue for active state)
            button.classList.add('bg-blue-100', 'text-blue-800');
            button.classList.remove('text-slate-600', 'hover:bg-blue-50', 'hover:text-blue-700');

            // Show the corresponding tab content
            const targetTab = button.dataset.tab;
            const targetContent = document.getElementById(`${targetTab}-content`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
                // If the events tab is clicked, fetch events
                if (targetTab === 'events') {
                    fetchEvents();
                }
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
            setPointCounter("Survey");
            /*surveyResultDisplay.classList.remove('hidden');
            surveyResultDisplay.textContent = `Total Health Score: ${totalScore}`; */
            dailySurveyCompleted = true;
            console.log("Final Survey Score:", totalScore);
            sendResults(scores, totalScore);
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

    async function sendResults(answers, totalScore) {
        const data = {
            score: totalScore,
            answers: answers,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch('http://localhost:8080/api/burnout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.text();
            console.log('Server response:', result);
        } catch (error) {
            console.error('Failed to send data:', error);
        }
    }

    // Function to create an event component
    function createEventComponent(event) {
        const wrapper = document.createElement('div');
        wrapper.className = 'mb-4 p-4 border rounded-lg shadow-sm bg-white flex items-center justify-between';

        // Left: Event info
        const infoDiv = document.createElement('div');
        infoDiv.className = 'flex-1';

        // Event Name
        const name = document.createElement('div');
        name.className = 'font-semibold text-black text-lg mb-1';
        name.textContent = event.name || 'Untitled Event';

        // Event Start Date
        const startsAt = document.createElement('div');
        startsAt.className = 'text-sm text-black mb-1';
        startsAt.textContent = event.startsAt ? `Starts at: ${event.startsAt}` : '';

        // Event Status
        const status = document.createElement('div');
        status.className = 'text-xs font-medium text-black mb-1';
        status.textContent = event.status ? `Status: ${event.status}` : '';

        // Event Description
        const description = document.createElement('div');
        description.className = 'text-sm text-black';
        description.textContent = event.description || '';

        infoDiv.appendChild(name);
        if (event.startsAt) infoDiv.appendChild(startsAt);
        if (event.status) infoDiv.appendChild(status);
        if (event.description) infoDiv.appendChild(description);

        // Right: Attend button
        const attendBtn = document.createElement('button');

        attendBtn.textContent = 'Attend';
        attendBtn.className = 'ml-4 px-4 py-2 rounded-md bg-green-400 text-green-800 font-medium transition-colors hover:bg-green-500 focus:outline-none';

        attendBtn.addEventListener('click', function () {
            if (attendBtn.textContent === 'Attend') {
                attendBtn.textContent = 'Attending';
                setPointCounter("Event");
                attendBtn.className = 'ml-4 px-4 py-2 rounded-md bg-green-500 text-green-800 font-medium transition-colors';
            } else {
                attendBtn.textContent = 'Attend';
                attendBtn.className = 'ml-4 px-4 py-2 rounded-md bg-green-400 text-green-800 font-medium transition-colors hover:bg-green-500 focus:outline-none';
            }
        });

        wrapper.appendChild(infoDiv);
        wrapper.appendChild(attendBtn);

        return wrapper;
    }

    // Function to retrieve JSON events from the backend and display them
    async function fetchEvents() {
        const eventsContent = document.getElementById('events-content');
        // Remove old event components (but keep the heading and description)
        while (eventsContent.children.length > 2) {
            eventsContent.removeChild(eventsContent.lastChild);
        }
        try {
            const response = await fetch('http://localhost:8080/api/v1/events', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const events = await response.json();
            if (Array.isArray(events) && events.length > 0) {
                events.forEach(event => {
                    const eventComponent = createEventComponent(event);
                    eventsContent.appendChild(eventComponent);
                });
            } else {
                const noEvents = document.createElement('div');
                noEvents.className = 'mt-4 text-slate-500';
                noEvents.textContent = 'No events found.';
                eventsContent.appendChild(noEvents);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
            const errorMsg = document.createElement('div');
            errorMsg.className = 'mt-4 text-red-600';
            errorMsg.textContent = 'Failed to load events.';
            eventsContent.appendChild(errorMsg);
        }
    }

    async function fetchTeamPoints() {
        const currentPointsSpan = document.getElementById('current-points');
        if (!currentPointsSpan) {
            console.error("Point counter span not found.");
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/v1/team-scores/total', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const res = await response.json(); // Expecting { totalPoints: number }
            currentPointsSpan.textContent = res.totalPoints !== undefined ? res.totalPoints : 'N/A';
        } catch (error) {
            console.error('Failed to fetch team points:', error);
            currentPointsSpan.textContent = 'Error';
        }
    }

    async function setPointCounter(actionType) {

        if (actionType == "Survey") {
            try {

                const data = {
                    teamId: 1,
                    points: 1,
                };

                const response = await fetch('http://localhost:8080/api/v1/team-scores/survey', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.text();
                console.log('Server response:', result);
                fetchTeamPoints(); // Refresh points after survey submission
            }
            catch (error) {
                console.error('Failed to send data:', error);

            }
        }
        else if (actionType == "Event") {
            try {

                const data = {
                    teamId: 1,
                    points: 5,
                };

                const response = await fetch('http://localhost:8080/api/v1/team-scores/attend', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.text();
                console.log('Server response:', result);
                fetchTeamPoints(); // Refresh points after event attendance
            }
            catch (error) {
                console.error('Failed to send data:', error);

            }
        }

    }

    submitAnswerBtn.addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="health-score"]:checked');
        if (selectedOption) {
            scores.push(parseInt(selectedOption.value, 10));
            totalScore += parseInt(selectedOption.value, 10);
            currentQuestionIndex++;
            displayQuestion();
            updateSurveyProgressBar(); // Update progress bar after each answer
        } else {
            alert("Please select a score before submitting.");
        }
    });
});