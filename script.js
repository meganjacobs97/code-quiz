// get elements 
var beginButton = document.querySelector("#begin-button"); 
var scoreForm = document.querySelector("#score-form"); 
var submitText = document.querySelector("#submit-text"); 
var highScoresLink = document.querySelector("#highscores-link"); 
var startOverButton = document.querySelector("#start-over"); 
var clearScoresButton = document.querySelector("#clear-scores");
var highScoresDiv = document.querySelector("#highscores-div");
var beginPage = document.querySelector("#begin-page"); 
var tableBody = document.querySelector("#table-body"); 
var highScoresSection = document.querySelector("#highscores"); 
var timer = document.querySelector("#timer"); 

var score = 0; //user score
var scoresArr = []; //for saving scores 
var secondsLeft; //seconds left in the quiz 

//click action listener - for answer buttons and high scores link 
addEventListener("click",function(event) {
    
    event.preventDefault(); //stop default behavior 
    
    var buttonID = event.target.getAttribute("id"); // get id of think being clicked 

    //only do anything if its a button thats not the submit scores button or score control buttons
    if(event.target.matches("button") && buttonID != "submit-scores" && buttonID != "start-over" && buttonID != "clear-scores" ) {
        
        //this will be the one we use if we are on the start page
        var currentSectionIDBegin = event.target.parentElement.getAttribute("id"); 
        //this will be the one we use if we are on a question
        var currentSectionIDQuestions = event.target.parentElement.parentElement.parentElement.getAttribute("id"); 

        //if this is a button that corressponds with a correct answer 
        if(event.target.getAttribute("class") === "correct") {
            //increase score
            score++; 
        }
        //wrong answer selected; remove time 
        else if(buttonID !="begin-button") {
            if(secondsLeft > 10) {
                secondsLeft -= 10; 
            }
            //if deducting time would cause timer to run out, need to end game 
            else {
                secondsLeft = 1; 
            }
        }

        //call function to go to the next section 
        if(currentSectionIDBegin === null) { //if theres no id on the most immediate parent
            //pass next ancestor id 
            renderNextSection(currentSectionIDQuestions); 
        }
        else {
            renderNextSection(currentSectionIDBegin); 
        }
    }
    //else - clicked highscores link
    else if(buttonID === "highscores-link") {
        renderHighScores(beginPage.getAttribute("id")); 
    }
});

//action listener for begin quiz button 
beginButton.addEventListener("click",function(event) {
    //reset seconds left 
    secondsLeft = 60; 
    //show on the page
    timer.textContent = secondsLeft; 
    //start timer 
    setTime(); 
}); 

//listener for when scores are submitted 
scoreForm.addEventListener("click",function(event) {
    //stop form from default behavior 
    event.preventDefault(); 
    //only want to do anything if submit was clicked 
    if(event.target.matches("button")) {
        var currentSectionID = event.target.parentElement.parentElement.getAttribute("id"); 

        //grab input name 
        var input = submitText.value;

        //make sure array isnt null
        if(scoresArr === null) {
            scoresArr = []; //if it is, make the array 
        }

        //add score to array
        scoresArr.push({"name":input,"score":score})
        //resort array
        scoresArr.sort(compare); 

        //use localstorage to store scores 
        if(localStorage.getItem("scores") !== null) { //clean out scores if they are already in there
            localStorage.removeItem("scores"); 
        }

        //add all values back in 
        localStorage.setItem("scores",JSON.stringify(scoresArr)); 

        //show high scores section 
        renderHighScores(currentSectionID); 
    }
}); 

//listener for clear scores button 
clearScoresButton.addEventListener("click",function(event) {
    //empty out array
    scoresArr = []; 

    //remove array from storage
    localStorage.removeItem("scores"); 

    //remove list items from the page 
    tableBody.innerHTML = ""; 
}); 

//listener for start over button 
startOverButton.addEventListener("click",function(event) {
    //reset score
    score = 0; 

    //make high scores link visible again 
    highScoresDiv.removeAttribute("class"); 

    //get current section
    var currentSection = event.target.parentElement;
    //hide current section
    currentSection.setAttribute("class","hidden"); 
    currentSection.removeAttribute("data-current"); 
    //show original page
    beginPage.removeAttribute("class"); 
    beginPage.setAttribute("data-current","current")
}); 

//renders next section and hides the current one 
function renderNextSection(currentSectionID) {
    var currentSection = document.querySelector("#" + currentSectionID);  
    var nextSection = currentSection.nextElementSibling; 
    
    //hide current section 
    currentSection.setAttribute("class","hidden"); 
    currentSection.removeAttribute("data-current","current");

    //also hide high scores link if it needs to be hidden
    if(highScoresDiv.getAttribute("class") === null) {
        highScoresDiv.setAttribute("class","hidden"); 
    }

    //show next section
    nextSection.removeAttribute("class"); 
    nextSection.setAttribute("data-current","current")

    //make sure to stop timer if next section is the quiz completed section 
    if(nextSection.getAttribute("id") === "quiz-complete") {
        //set to 1 so timer doesnt go below zero 
        secondsLeft = 1; 
    }
}

//renders high scores section and hides current section 
function renderHighScores(currentSectionID) {
    var currentSection = document.querySelector("#" + currentSectionID); 
    
    //remove current table data from the page 
    tableBody.innerHTML = ""; 

    //grab scores from local storage 
    scoresArr = JSON.parse(localStorage.getItem("scores")); 
    
    if(scoresArr !== null) { //if there are scores to put on the page
        //step through array
        for(var i = 0; i < scoresArr.length; i++) {
            //create row
            var tableRow = document.createElement("tr");
            //create row entry 
            var rankData = document.createElement("td"); 
            rankData.textContent = i + 1;  
            //create name entry
            var nameData = document.createElement("td"); 
            nameData.textContent = scoresArr[i].name; 
            //create scores entry 
            var scoreData = document.createElement("td"); 
            scoreData.textContent = scoresArr[i].score; 
            //add to row
            tableRow.appendChild(rankData); 
            tableRow.appendChild(nameData); 
            tableRow.appendChild(scoreData); 
            //add row to table 
            tableBody.appendChild(tableRow);
        }
    }
    
    //hide current section 
    currentSection.setAttribute("class","hidden"); 
    currentSection.removeAttribute("data-current"); 
    //show high scores 
    highScoresSection.removeAttribute("class"); 
    highScoresSection.setAttribute("data-current","current");
}


//for sorting scoresarr - sorts in descending order 
//code modified from https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
function compare(a, b) {
    var A = a.score;
    var B = b.score;
  
    var comparison = 0;
    if (A > B) {
      comparison = 1;
    } else if (A < B) {
      comparison = -1;
    }
    //invert return value by multiplying by -1
    return comparison * -1;
}

//starts & tracks timer 
function setTime() {
    var timerInterval = setInterval(function() {
        secondsLeft--; //decrement time 
        timer.textContent = secondsLeft; //display time left  

        //when time runs out 
        if(secondsLeft === 0) {
            clearInterval(timerInterval); //stop timer 

            //hide current section
            var currentSection = document.querySelector("[data-current='current']"); 
            currentSection.setAttribute("class","hidden"); 
            currentSection.removeAttribute("data-current"); 

            //show submit scores form 
            var submitSection = document.querySelector("#quiz-complete"); 
            submitSection.setAttribute("class","current"); 
            submitSection.setAttribute("data-current","current"); 
        }
    }, 1000); //interval is 1 second long 
}
