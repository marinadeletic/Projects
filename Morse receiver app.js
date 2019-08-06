// reciever app

var errorCallback = function (e) {
    console.log('Rejected: Use HTTPS protocol!', e);
};


navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

var video  = document.querySelector('video');

var messageFinishedFlag = false;   // boolean variable: true if the transmission has ended, false otherwise

var canvas = document.querySelector('canvas');
var ctx              = canvas.getContext('2d');
var localMediaStream = null;
var capturingIntervalID;

var unitTime = 200;      // Camera capturing interval


if (typeof MediaStreamTrack === 'undefined')
{
    cameraFailed();
}
else
{
    MediaStreamTrack.getSources(processCameraSources);
}


function cameraFailed()
{
    var message = '<span class="errorMessage">Back camera not supported on this device.</span>';
    document.getElementById("cameraContainer").innerHTML = message;
}

/*
 * This function retrieves  the list of audio and video resources and selects the rear camera only
 */
function processCameraSources(sourceInfos)
{
    var audioSource = null;
    var videoSource = null;

    for (var i = 0; i != sourceInfos.length; ++i)
    {
        var sourceInfo = sourceInfos[i];
        if (sourceInfo.kind === 'audio')
        {
            console.log(sourceInfo.id, sourceInfo.label || 'microphone');

            audioSource = sourceInfo.id;
        }
        else if (sourceInfo.kind === 'video')
        {
            console.log(sourceInfo.id, sourceInfo.label || 'camera');

            videoSource = sourceInfo.id;
        }
        else
        {
            console.log('Some other kind of source: ', sourceInfo);
        }
    }

    sourceSelected(audioSource, videoSource); 
    
    /*
    * timeout function to ensure the video is fully loaded in order to 
    * avoid this error:
    *     Failed to execute 'getImageData' on 'CanvasRenderingContext2D':
    *     The source width is 0
    */
    setTimeout(function () {
        capturingIntervalID = setInterval(snapshot, unitTime);
    }, 2000);
}


function sourceSelected(audioSource, videoSource)
{
    var constraints = {
        audio: false,
        video: {
            optional: [{sourceId: videoSource}]
        }
    };

    if (navigator.getUserMedia)
    {
        navigator.getUserMedia(constraints, function (stream) {
            video.src        = window.URL.createObjectURL(stream);
            localMediaStream = stream;
            //   updateImageData();
            //   requestAnimationFrame(draw);
        }, errorCallback);
    }
    else
    {
        cameraFailed();
    }
}


function snapshot()
{
    var imageData;
    var imageStatus;
    if (localMediaStream)
    {
        canvas.setAttribute('width', 180);
        canvas.setAttribute('height', 240);
        ctx.drawImage(video, 66, 100, 320, 480, 0, 0, 120, 180);
        imageData   = ctx.getImageData(0, 0, 120, 180).data;
        imageStatus = decodeCameraImage(imageData);
        if (!messageFinishedFlag)
        {    
            // Used to ignore the last image since the image status is currently green due to call messageFinish function.
            setImageStatus((imageStatus) ? 'onSignal' : 'offSignal');
        }
    }
}


function messageFinished()
{
    clearInterval(capturingIntervalID);
    setImageStatus('ready');
    messageFinishedFlag = true;
}


/*
 * This function is called when the user clicks the restart button
 */
document.getElementById('restartButton').onclick = function () {

    clearInterval(capturingIntervalID);
    setImageStatus('restart');
    capturingIntervalID = setInterval(snapshot, unitTime);
    messageFinishedFlag = false;
};


/*
 * This function accepts three input strings:
 *   * 'onSignal' : red status
 *   * 'offSignal' : Blue status
 *   * 'ready': Green Status
 *   * 'restart': green status
 */
function setImageStatus(status)
{
    if (status === 'onSignal')
    {
        document.getElementById("imgStatus").className = "mdl-button mdl-js-button mdl-button--fab mdl-color--red";
    }
    else if (status === 'offSignal')
    {
        document.getElementById("imgStatus").className = "mdl-button mdl-js-button mdl-button--fab mdl-color--blue";
    }
    else if (status === 'ready')
    {
        document.getElementById("imgStatus").className = "mdl-button mdl-js-button mdl-button--fab mdl-color--green";
        document.getElementById("spinner").classList.remove('is-active');  // Stop the spinner
    }
    else if (status === 'restart')
    {
        document.getElementById("imgStatus").className = "mdl-button mdl-js-button mdl-button--fab mdl-color--green";
        document.getElementById("spinner").classList.add('is-active');   // Start the spinners
    }
}
