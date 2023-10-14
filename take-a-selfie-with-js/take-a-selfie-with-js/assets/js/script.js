var imageLists = [];
const labels = [
  "Please put your face straight into the camera!",
  "Please turn your face right!",
  "Please turn your face left!",
  "Please turn your face up!",
  "Please turn your face down!",
];
const gifs = [
  "https://i.gifer.com/3OYiI.gif",
  "https://i.gifer.com/3OYiE.gif",
  "https://i.gifer.com/3OYiG.gif",
  "https://i.gifer.com/3OYiF.gif",
  "https://i.gifer.com/3OYiH.gif",
];
// document.addEventListener("DOMContentLoaded", function () {
// References to all the element we will need.
const video = document.querySelector("#sefid_container_main_part1_camera");
const take_photo_btn = document.getElementById("take-photo");
const imageProcessor = document.getElementById(
  "sefid_container_main_part1_canvas"
);
const selfidGallerry = document.getElementById("sefid_container_main_gallery");
const intruction = document.getElementById("sefid_container_intruction");
const intructionGif = document.querySelector(
  "#sefid_container .sefid_container_demo img"
);
const demo = document.querySelector("#sefid_container .sefid_container_demo");
const buttons = document.querySelector(
  ".sefid_container_main_buttons_container"
);
var missingLabels = [];
var missingGif = [];
var checkNumberImages = setInterval(() => {
  if (imageLists.length >= 5) {
    buttons.style.display = "block";
    take_photo_btn.disabled = true;
    intruction.innerHTML = "Finished";
    demo.style.display = "none";
  } else {
    demo.style.display = "block";
    buttons.style.display = "none";
    take_photo_btn.disabled = false;
    intruction.innerHTML = missingLabels[0];
    intructionGif.setAttribute("src", missingGif[0]);
    let existingGifs = imageLists.map((item) => item.gifURL);
    missingGif = gifs.filter((item) => !existingGifs.includes(item));
    let existingLabels = imageLists.map((item) => item.title);
    missingLabels = labels.filter((item) => !existingLabels.includes(item));
    // console.log(missingLabels);
  }
}, 10);
// The getUserMedia interface is used for handling camera input.
// Some browsers need a prefix so here we're covering all the options
navigator.getMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

if (!navigator.getMedia) {
  displayErrorMessage(
    "Your browser doesn't have support for the navigator.getUserMedia interface."
  );
} else {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => {
      console.error(`Oh no, there's an error`, err);
    });
}
imageProcessor.width = 320;
imageProcessor.height = 240;
function takePicture() {
  // e.preventDefault();
  var context = imageProcessor.getContext("2d");
  video.classList.add("fade-in");
  context.drawImage(video, 0, 0, imageProcessor.width, imageProcessor.height);
  setTimeout(() => video.classList.remove("fade-in"), 500);
  var imageURL = imageProcessor.toDataURL();
  var temp = document.createElement("div");
  temp.innerHTML = `<img src="${imageURL}">
            <button  id="${imageURL}" title="Delete Photo")">
               <i class="material-icons">delete</i>
             </button>`;
  selfidGallerry.appendChild(temp);
  document.getElementById(imageURL).addEventListener("click", (event) => {
    event.preventDefault();
    DeletePose(event, temp, imageURL);
  });
  imageLists.push({
    title: `${missingLabels[0]}`,
    imageURL: imageURL,
    gifURL: `${missingGif[0]}`,
  });

  intruction.innerHTML = missingLabels[1];
  intructionGif.setAttribute("src", missingGif[1]);
}

take_photo_btn.addEventListener("click", (event) => takePicture(event));
document.addEventListener("keypress", function (event) {
  // event.preventDefault();
  // If the user presses the "Enter" OR "Space" key on the keyboard
  if (imageLists.length <= 4) {
    if (event.key === "Enter" || event.key === " ") {
      takePicture();
    }
  }
});

function DeletePose(event, element, imageURL) {
  event.preventDefault();
  selfidGallerry.removeChild(element);
  imageLists = imageLists.filter((item) => item.imageURL != imageURL);
}
function ValidateInfor() {
  let MSSV = document.getElementById("MSSV").value;
  let classID = document.getElementById("ClassID").value;
  if (MSSV === "") {
    alert("Please fill in the required field.");
    document.getElementById("MSSV").style.border = "5px solid red";
    return;
  }
  if (classID === "") {
    alert("Please fill in the required field.");
    document.getElementById("ClassID").style.border = "5px solid red";
    return;
  }
  if (!isNaN(MSSV)) {
    Submit();
  } else {
    alert("Not a valid MSSV");
    return;
  }
}

document
  .getElementById("MSSV")
  .addEventListener(
    "blur",
    () => (document.getElementById("MSSV").style.border = "4px solid white")
  );
document
  .getElementById("MSSV")
  .addEventListener(
    "keypress",
    () => (document.getElementById("MSSV").style.border = "4px solid white")
  );

document
  .getElementById("ClassID")
  .addEventListener(
    "blur",
    () => (document.getElementById("MSSV").style.border = "2px solid white")
  );
document
  .getElementById("ClassID")
  .addEventListener(
    "keypress",
    () => (document.getElementById("MSSV").style.border = "2px solid white")
  );

async function Submit() {
  var MSSV = document.getElementById("MSSV").value;
  intruction.innerHTML = "Register Completed";
  var url = "https://daotaoai.tech:59810/add_data";
  // var url = "http://localhost:8019/api/v1/StudentImages/upload";
  var dataSend = imageLists.map((item) => item.imageURL);
  // dataZip = dataSend.map((item) => zip(item));
  // console.log(dataZip)
  var xhr = new XMLHttpRequest();
  var data = {
    mssv: MSSV,
    approveCode: "2",
    timeSelfie: new Date(),
    listImages: dataSend,
    inforTA: "",
    timeApprove: "",
    note: "",
  };
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log("Photos uploaded successfully!");
        console.log(this.response);
      } else {
        console.error("Error uploading photos." + xhr.responseText);
      }
    }
  };

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.send(JSON.stringify(data));
  clearInterval(checkNumberImages);
  document.querySelector(
    ".sefid_container_main_buttons_container #submit"
  ).disabled = true;
}


function zip(item){
  const binaryString = atob(item.split(',')[1]);

// Convert the binary string to a Uint8Array
const uint8Array = new Uint8Array(binaryString.length);
for (let i = 0; i < binaryString.length; i++) {
  uint8Array[i] = binaryString.charCodeAt(i);
}

// Compress the Uint8Array using pako
const compressedData = pako.gzip(uint8Array);

// Encode the compressed data back to a Base64 string
const compressedBase64Image = btoa(String.fromCharCode.apply(null, compressedData));
  return compressed_image;
  
}