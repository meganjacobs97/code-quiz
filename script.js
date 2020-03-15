//var beginButton = document.querySelector("#begin-button"); 
var scoreForm = document.querySelector("#score-form"); 
var submitText = document.querySelector("#submit-text"); 
var highScoresLink = document.querySelector("#highscores-link"); 
var startOverButton = document.querySelector("#start-over"); 
var clearScoresButton = document.querySelector("#clear-scores");
var highScoresDiv = document.querySelector("#highscores-div");
var beginPage = document.querySelector("#begin-page"); 

var score = 0; 
var scoresArr = []; 


addEventListener("click",function(event) {
    //stop default behavior 
    event.preventDefault(); 
    var buttonID = event.target.getAttribute("id"); 
    //only do anything if its a button thats not the submit scores button or score control buttons
    if(event.target.matches("button") && buttonID != "submit-scores" && buttonID != "start-over" && buttonID != "clear-scores") {
        
        //this will be the one we use if we are on the start page
        var currentSectionIDBegin = event.target.parentElement.getAttribute("id"); 
        //this will be the one we use if we are on a question
        var currentSectionIDQuestions = event.target.parentElement.parentElement.parentElement.getAttribute("id"); 
    
        

        //if this is a button that corressponds with a correct answer 
        if(event.target.getAttribute("class") === "correct") {
            //increase score
            score++; 
            //TODO DELETE
            console.log("correct answer selected");
        }
        //TODO DELETE
        console.log(buttonID); 
        console.log("Immediate parent id: " + currentSectionIDBegin); 
        console.log("next: " + event.target.parentElement.parentElement.parentElement.getAttribute("id")); 

        //call function to go to the next section 
        //if theres no id on the most immediate parrent
        if(currentSectionIDBegin === null) {
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

scoreForm.addEventListener("click",function(event) {
    //stop form from default behavior 
    event.preventDefault(); 
    //only want to do anything if submit was clicked 
    if(event.target.matches("button")) {
        var currentSection = event.target.parentElement.parentElement.getAttribute("id"); 
        

        //TODO - GRAB INPUT, STORE HIGH SCORES IN ARRAY OR OBJECT THAT SORTS EVERY TIME 
        //grab input name 
        var input = submitText.value;
        //add to array
        scoresArr.push({"name":input,"score":score})
        //resort array
        scoresArr.sort(compare); 


        renderHighScores(currentSection); 

    }

}); 

clearScoresButton.addEventListener("click",function(event) {
    //empty out array

    //remove list items from the page 
}); 

startOverButton.addEventListener("click",function(event) {
    //reset score
    score = 0; 

    //make high scores link visible again 
    highScoresDiv.removeAttribute("class"); 

    //get current section
    var currentSection = event.target.parentElement;
    //hide current section
    currentSection.setAttribute("class","hidden"); 
    //show original page
    beginPage.removeAttribute("class"); 
    

})


function renderNextSection(currentSectionID) {
    var currentSection = document.querySelector("#" + currentSectionID);  
    var nextSection = currentSection.nextElementSibling; 
    //hide current section 
    currentSection.setAttribute("class","hidden"); 

    //also hide high scores link if it needs to be hidden
    if(highScoresDiv.getAttribute("class") === null) {
        highScoresDiv.setAttribute("class","hidden"); 
    }

    //show next section
    nextSection.removeAttribute("class"); 
}

function renderHighScores(currentSectionID) {
    var currentSection = document.querySelector("#" + currentSectionID); 
    var highScoresSection = document.querySelector("#highscores"); 


    //GRAB HIGH SCORES AND PUT THEM IN TABLE 
    

    //only show/hide page if we're intially rendering, not clearing scores 
    if(currentSection !== null) {
        //hide current section 
        currentSection.setAttribute("class","hidden"); 
        //render high scores 
        highScoresSection.removeAttribute("class"); 
    }

}
//for sorting scoresarr - sorts in descending order 
//code modified from https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    console.log("IN SORTING"); 
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