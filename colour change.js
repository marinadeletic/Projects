/*
* Purpose: This file is designed to decode the cameras image from the reciver app
* Team: 41
* Author: Marina Deletic, Brandon Clarkson, Louis Choy, Hanbo Ding\
* Last Modified: 10 April 2016
*/



var morseCode = [];
var morseTable = {

    // letters 

    '.-': 'A',
    '-...': 'B',
    '-.-.': 'C',
    '-..': 'D',
    '.': 'E',
    '..-.': 'F',
    '--.': 'G',
    '....': 'H',
    '..': 'I',
    '.---': 'J',
    '-.-': 'K',
    '.-..': 'L',
    '--': 'M',
    '-.': 'N',
    '---': 'O',
    '.--.': 'P',
    '--.-': 'Q',
    '.-.': 'R',
    '...': 'S',
    '-': 'T',
    '..-': 'U',
    '...-': 'V',
    '.--': 'W',
    '-..-': 'X',
    '-.--': 'Y',
    '--..': 'Z',

    // Numbers

    '-----': '0',
    '.----': '1',
    '..---': '2',
    '...--': '3',
    '....-': '4',
    '.....': '5',
    '-....': '6',
    '--...': '7',
    '---..': '8',
    '----.': '9',

    // Punctuation

    '.----.': "'",
    '.-.-.-': '.',
    '--..--': ',',
    '---...': ':',
    '..--..': '?',
    '-....-': '-',
    '-..-.': '/',
    '.--.-.': '@',
    '-...-': '=',
    '-.--.': '(',
    '-.--.-': ')',
    '.-..-.': '"',
    '.-.-.': '+',
    '...-..-': '$',
    '..--.-': '_',
    '-.-.--': '!',

    // Prosigns
    '': '',
    '.-.-': "\n", // New line
    '...-.-': 'SK' // End-of-Transmission
};      
var output = ''
var messageOutput = document.getElementById("messageField")
var prevColour = false
var length = 0                  // the length of the colour ie. how many snapshots of one colour before it changes 
document.getElementById("restartButton").onclick = restartButtonClicked;



/* The function determains whether the colour of the overall image is blue or red - on or off 
 *      It calculates the total sum of the red, blue and green values of all the pixels in the snapshot of data (first three for statements)
 *      Then compares the total red value to both the total blue and green values,
 *      If the red sum is higher than the others then the colour is red
 *      It then returns the value of true for red and false for blue 
 */

function colourOfSignal(data) 
{
    var sumRed = 0
    var sumBlue = 0
    var sumGreen = 0
    for (var i = 0; i < data.length - 1; i = i + 4) 
    {
        sumRed += data[i]
    }

    for (var j = 2; j < data.length - 1; j = j + 4) 
    {
        sumBlue += data[j]
    }
    for (var k = 1; k < data.length - 1; k = k + 4) 
    {
        sumGreen += data[k]
    }


    if (sumRed > sumBlue && sumRed > sumGreen) 
    {
        return true //Red
    } 
    else 
    {
        return false; //Blue
    }
}



/* Determains whether the signal is a dot, dash, end of letter or space 
 *      Function has the parameters of the length of the signal (len) and where the signal is on or off (onOrOff)
 *      the function goes through a series of isolated if else statements to return the appropriate element 
 *      If the signal is on (red = true) and is between 1 to two time units it is a dot 
 *      If the signal is on and is greater than 3 time units it is a dash
 *      If the signal is off(blue = false) and length of 1 to 2 time units it is an inter elementary signal so it returns "" to symbolise nothing 
 *      If the signal is off and between 3 to six time units it is the end of a letter symbolised as #
 *      If the signal is off and longer than 6 time units it is a space - this is the else statement 
 */
function convertToDotOrDash(len, onOrOff) 
{
    if (onOrOff === true && (len === 1 || len === 2)) 
    {
        return ".";
    } 
    else if (onOrOff === true && len >= 3)
    {
        return "-";
    } 
    else if (onOrOff === false && (len === 1 || len === 2))
    {
        return "";
    } 
    else if (onOrOff === false && len >= 3 && len <= 6)
    {
        return "#";
    } 
    else 
    {
        return " "
    }
}


/* when clicked the restartButtonClicked function resets the message output area
 *      The function also resets all the global variable back to their initial state 
 */

function restartButtonClicked() 
{

    morseCode = [];
    length = 0
    prevColour = false
    messageOutput.innerHTML = "";
    output = "";
}



/* This finction is called by the program in Reciverapp.js 
 *      Its parameters are the data array which it recives containing the array of pixel values in each snapshot taken
 *      The function first decides whether the snapshot is over all blue or red by calling the function colourOfSignal
 *      Once it has the colour it starts a tally of how many times that colour appears before it changes using the if else statement current     *      Colour = previous colour, and the length is defined by the number of times the colour apears 
 *      Once the colour has changed the function convertToDotOrDash is called, it uses the now previous colour(as the colour has changed) and the *      length of how many times it apreared and returns with the apropriate element (. - "" # or " ") 
 *      The elements are pushed into an array morseCode as they come until the element # or " " is recived at which point the array morseCode is *      joined into a string 
 *      The string is then found in the object morseTable and returns a letter which is added to the output as well as if a space is nessesary 
 *      The output is printed in the message space
 *      The morseCode array is reset for the next letter 
 *      It is important to note that the else statement which detects when the colour has changed also resets the previous colour to the current *      colour and make the length 1 so the next round has a comparison to the new previous colour 
 */
function decodeCameraImage(data) 
{
    var currentColour = colourOfSignal(data)

    if (currentColour === prevColour) 
    {
        length++
        prevColour = currentColour
    } 
    else 
    {
        // colour has changed 
        
        var element = convertToDotOrDash(length, prevColour)

        // places elements into array morseCode until end of letter (#) or space(' ')
        // then joins them and finds the letterCode in the morseTable, also adds space if needed 
        if (element === '#' || element === ' ') 
        {
            var letterCode = morseCode.join("");
            var letter = morseTable[letterCode];
            output += letter
            if (element === ' ') 
            {
                output += ' ';
            }
            messageOutput.innerHTML = output;
            morseCode = [];
        } 
        else 
        {
            morseCode.push(element);
            // this if statement checks whether SK - end of transmision has occoured 
            // if the message code is SK it calls the function messageFinished, turning the dot green 
            if (morseCode.join("") === '...-.-') 
            {
                messageFinished()
            }
        }

        prevColour = currentColour
        length = 1
    }

    return currentColour;

}