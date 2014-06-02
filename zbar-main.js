// Copyright (c) 2013 Yury Delendik
// Modified 2014, André Fiedler
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var video = document.querySelector('#video'),
	canvas = document.createElement('canvas');

var ctx = canvas.getContext('2d'),
    streaming = false,
	startTime = 0;

navigator.getMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
);

video.addEventListener('play', function (ev) {
    if (!streaming) {

        // resizing image for slow devices
        canvas.width = 480;
        canvas.height = Math.ceil(480 / video.clientWidth * video.clientHeight);

        streaming = true;
    }
}, false);

navigator.getMedia(
    {
        video: true,
        audio: false
    },
    function(stream) {

        if (navigator.mozGetUserMedia) {

            video.mozSrcObject = stream;

        } else {

            var vendorURL = window.URL || window.webkitURL;
            video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;

        }

        video.play();

        DecodeBar();
    },
    function(err) {
        console.log('An error occured! ' + err);
    }
);

var resultArray = [],
    workerCount = 0;

function receiveMessage(e) {

    workerCount--;

    //var endTime = new Date().getTime();
    //var time = endTime - startTime;
    //console.info('Execution time: ' + time);

    if (e.data.success === 'log') {
        console.log(e.data.result);
        return;
    }

    if (e.data.success) {
        alert(e.data.result.join("\n"));
        DecodeBar();
    } else {
        if (e.data.result.length === 0 && workerCount === 0) {
            console.error('Decoding failed.');
            DecodeBar();
        }
    }
}

var decodeWorker = new Worker('zbar-processor.js');
decodeWorker.onmessage = receiveMessage;

// Firefox Bug 879717 - drawImage on MediaStream assigned to <video> stopped working again
// See: https://bugzilla.mozilla.org/show_bug.cgi?id=879717
function drawVideo() {
    try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        decodeWorker.postMessage({
            imageData: ctx.getImageData(0, 0, canvas.width, canvas.height).data,
            width: canvas.width,
            height: canvas.height
        });
    } catch (e) {
        if (e.name === 'NS_ERROR_NOT_AVAILABLE') {
            setTimeout(drawVideo, 0);
        } else {
            throw e;
        }
    }
}

function DecodeBar() {
    resultArray = [];
    workerCount++;
    //startTime = new Date().getTime();	
    drawVideo();
}

// Firefox WebInstall
var canInstall = !!(navigator.mozApps && navigator.mozApps.install);
if (canInstall) {
    var installButton = document.getElementById('install');
    var manifestURL = installButton.href;
    var request = window.navigator.mozApps.checkInstalled(manifestURL);
    request.onsuccess = function(e) {
        if (request.result) {
            return;
        }
        // App is not installed
        installButton.removeAttribute('hidden');
        installButton.addEventListener('click', function(e) {
            var request = navigator.mozApps.install(manifestURL);
            request.onsuccess = function(e) {
                alert('Application installed');
            };
            e.preventDefault();
        }, false);
    };
}
