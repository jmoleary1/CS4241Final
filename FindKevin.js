var score = -1;


function increseScore(){
    score++;
    document.getElementById("score").innerHTML = "Score: " + score;
    document.getElementById("HiddenScore").value=score;
}

function GetScores() {
    console.log('does this thing');
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {
                console.log('this too');
                document.getElementById("scores").innerHTML = xmlhttp.responseText;
                console.log('even here');
                console.log(xmlhttp.responseText);
            }
            else if (xmlhttp.status == 400) {
                alert('There was an error 400');
            }
            else {
                alert('something else other than 200 was returned');
            }
        }
    };

    xmlhttp.open("GET", "GetScores", true);
    xmlhttp.send();
}