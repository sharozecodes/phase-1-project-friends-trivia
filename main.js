fetch("http://localhost:3000/questions")
    .then(resp => resp.json())
    .then(questions => {

        //Catching all the elements for later use
        let corrects = 0;
        let container = document.querySelector('#question-container');
        let optionsContainer = document.querySelector('#options-container');
        let nextBtn = document.querySelector('#next-btn');
        let playBtn = document.querySelector('#play');
        let scoreBtn = document.querySelector('#score');
        let replayBtn = document.querySelector('#replay');
        let scorebBtn = document.querySelector('#scoreb');
        let backBtn = document.querySelector('#back');
        let currentQuestionIndex = 0;
        let playerName = '';

        //Putting questions from the extracted object array to the DOM
        function showQuestion() {
            const currentQuestion = questions[currentQuestionIndex];
            container.textContent = currentQuestion.question;
            optionsContainer.textContent = '';
            currentQuestion.options.forEach(option => {
                const label = document.createElement('label');
                const radioBtn = document.createElement('input');
                radioBtn.type = 'radio';
                radioBtn.name = 'option';
                radioBtn.value = option;
                label.appendChild(radioBtn);
                label.append(option);
                label.style.display = 'block';
                optionsContainer.appendChild(label);
            })
        }
        
        //Checking the answers and notifying
        function checkAnswer() {
        const selectedOption = document.querySelector('input[name="option"]:checked').value;
        const answer = questions[currentQuestionIndex].answer;
        if (selectedOption === answer) {
            toastColor("green");
            showToast('Perfection!', 1000);
            corrects++;
        } else {
            toastColor("red");
            showToast('Moo Point!', 1000);
        }
        }

        showQuestion();

        //Adding eventListeners
        nextBtn.addEventListener('click', () => {
            try {
                checkAnswer();
                currentQuestionIndex++;
                if (currentQuestionIndex === questions.length) {
                    endTrivia();
                }
                showQuestion();
            } catch (error) {
                alert("Please select an option!")
              }     
        })
    
        menuButtonEventListeners(playBtn, scoreBtn, replayBtn, scorebBtn, backBtn);
        
        const form = document.querySelector("form");
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            playerName = event.target[0].value;
            if (playerName === '')
                alert('Please enter a name!');
            else {
            form.reset()
            displayGreeting(playerName);
            }
        })

        //Logic for wrapping up one round
        function endTrivia() {
            displayResult(playerName, corrects, questions.length);
            saveScore(playerName,corrects);
            const element = document.querySelector("#container");

            //Clears the container
            element.remove();

            //Making new container
            const newContainer = document.createElement("div");
            newContainer.id = "container";
            document.body.appendChild(newContainer);
            const tagLine = document.createElement('h2');
            tagLine.textContent = "Could this question BE any easier?";
            const questionContainer = document.createElement("div");
            questionContainer.id = "question-container";
            const optContainer = document.createElement("div");
            optContainer.id = "options-container";
            const btn = document.createElement("button");
            btn.id = "next-btn";
            btn.textContent = "Next";
            const imgContainer = document.createElement("div");
            imgContainer.className = "overlay"
            const imgHolder = document.createElement("img");
            imgHolder.src = "./images/friends.PNG";
            imgHolder.alt = "Overlay image";
            imgContainer.appendChild(imgHolder);       
            newContainer.appendChild(tagLine);
            newContainer.appendChild(questionContainer);
            newContainer.appendChild(optContainer);
            newContainer.appendChild(btn);
            newContainer.appendChild(imgContainer);
            corrects = 0;
            currentQuestionIndex = 0;

            container = document.querySelector('#question-container');
            optionsContainer = document.querySelector('#options-container');
            nextBtn = document.querySelector('#next-btn');
            showQuestion();
            nextBtn.addEventListener('click', () => {
                try{
                    checkAnswer();
                    currentQuestionIndex++;
                    if (currentQuestionIndex === questions.length) {
                        endTrivia();
                    }
                    showQuestion();                 
                }catch (error) {
                    alert("Please select an option!")
                  }
                })
            }
    });


    //Fetching data to view from the players field
    function viewScoreBoard(){
        fetch("http://localhost:3000/players")
            .then(resp => resp.json())
            .then(players => {
                createTable(sortScoreBoard(players))})
        displayScoreboard();
    }

    //Logic to display the correct or incorrect notification
    function showToast(message, duration = 3000) {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.getElementById('toast');
        toast.style.display = "flex";
      
        toast.textContent = message;
        toastContainer.style.display = 'block';
      
        setTimeout(() => {
          toastContainer.style.display = 'none';
        }, duration);
    }

    //Defining the notification color for the answer check
    function toastColor(color) {
        const notification = document.getElementById("toast");
        if (color.toLowerCase() === "green") {
          notification.style["background-color"] = 'rgba(0, 255, 0, 0.4)';
        } else {
          notification.style["background-color"] = 'rgba(255, 0, 0, 0.4)';
        }
    }
    
    //Code to make questions container visible
    function startQuestions(){
        let choiceContainer = document.querySelector('#choice-container');
        let resultContainer = document.querySelector('#result-container');
        let scoreContainer = document.querySelector('#score-container');
        let container = document.querySelector('#container');
            container.style.display = "block"
            choiceContainer.style.display = "none"
            resultContainer.style.display = "none"
            scoreContainer.style.display = "none"
    }

    //Code to make form container visible
    function tryAgain(){
        let formContainer = document.querySelector('#form-container');
        let resultContainer = document.querySelector('#result-container');
        let scoreContainer = document.querySelector('#score-container');
        let container = document.querySelector('#container');
            container.style.display = "none"
            formContainer.style.display = "flex"
            resultContainer.style.display = "none"
            scoreContainer.style.display = "none"
    }

    //Code to make score container visible
    function displayScoreboard(){
        let formContainer = document.querySelector('#form-container');
        let resultContainer = document.querySelector('#result-container');
        let scoreContainer = document.querySelector('#score-container');
        let choiceContainer = document.querySelector('#choice-container');
        let container = document.querySelector('#container');
            container.style.display = "none"
            formContainer.style.display = "none"
            resultContainer.style.display = "none"
            choiceContainer.style.display = "none"
            scoreContainer.style.display = "flex"
    }

    //Saving the score to the db.json using POST request
    function saveScore(playerName, corrects){
        let newPlayer = { player: playerName, score: corrects };
            fetch("http://localhost:3000/players", {
            method: "POST",
            body: JSON.stringify(newPlayer),
            headers: {
                "Content-Type": "application/json"
            }
            })
    }
    
    //Code to display the greeting and the menu screen
    function displayGreeting(playerName) {
        let formContainer = document.querySelector('#form-container');
        let choiceContainer = document.querySelector('#choice-container');
        let scoreContainer = document.querySelector('#score-container');
        let greeting = choiceContainer.querySelector('#greeting');

        choiceContainer.style.display = "flex"
        formContainer.style.display = "none"
        scoreContainer.style.display = "none"
        greeting.textContent = `Hey there, ${playerName}! How you doin'?`        
    }

    //Code to make result container visible
    function displayResult(playerName, score, total){
        let resultContainer = document.querySelector('#result-container');
        let container = document.querySelector('#container');
        let scoreContainer = document.querySelector('#score-container');
        let result = resultContainer.querySelector('#player-result');
        let scoreTotal = resultContainer.querySelector("#score-total");
        
        container.style.display = "none"
        resultContainer.style.display = "flex"
        scoreContainer.style.display = "none"
        const percentage = score/total;
        
        result.textContent = `${getGrade(percentage)}, ${playerName}!`;
        scoreTotal.textContent = `You scored a ${score} out of ${total}.`;
    }

    //Function to add EvenListeners to similar buttons
    function menuButtonEventListeners(playBtn, scoreBtn, replayBtn, scorebBtn, backBtn){
        
        playBtn.addEventListener('click', () => {
            startQuestions();
        })
        scoreBtn.addEventListener('click', () => {
            viewScoreBoard();
        })
        replayBtn.addEventListener('click', () => {
            tryAgain();
        })
        scorebBtn.addEventListener('click', () => {
            viewScoreBoard();
        })
        backBtn.addEventListener('click', () => {
            tryAgain();
        })
    }

    //Sorting the retrieved scoreboard first by score then by ID
    function sortScoreBoard(scoreBoard){
       return scoreBoard.sort((a, b) => {
            if (a.score === b.score) {
              return b.id - a.id;
            }
            return b.score - a.score;
          });    
      }

    //Generating custom captions as per grade
    function getGrade(percentage) {
        if (percentage >= 0.9) {
            return 'Excellent job';
        } else if (percentage >= 0.8) {
            return 'Well done'
        } else if (percentage >= 0.7) {
            return 'Good job'
        } else if (percentage >= 0.6) {
            return 'Not bad'
        } else {
            return "Yeah! We're definitely on a break"
            };
        }
         
    //Creating scoreboard table
    function createTable(scoreBoard){
        const tbody = document.getElementById('table-body');
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
          }
          
        for (let i = 0; i < scoreBoard.length; i++) {
            if(i===5){
                break; 
            } else {
            const player = scoreBoard[i].player;
            const score = scoreBoard[i].score;

            const row = document.createElement('tr');
            const playerCell = document.createElement('td');
            const scoreCell = document.createElement('td');

            playerCell.textContent = player;
            scoreCell.textContent = score;

            row.appendChild(playerCell);
            row.appendChild(scoreCell);
            tbody.appendChild(row);
        }
        }
    }


