var totalPages;
var classID="course-v1:EDTECH AI01 1";
var pageNumber = 0;
var pageEvidence=0;
const pageSize = 5;
var isReady=false;
var keyword = "";
var tempData;
var sortDirection = "ASC";
var sortProperty = "timeJoin";
const tableData = document.getElementById(
  "attendances_student_table__body_tableData"
);
const searchInput = document.getElementById("search_input");
const searchImg = document.getElementById("search_img");
const popup = document.querySelector(".container_gallery");
const table_headings = document.querySelectorAll("thead th");
const table_rows = document.querySelectorAll("tbody tr");

// Search User
searchImg.addEventListener("click", () => {
  keyword = searchInput.value;
  if (keyword != null) {
    renderTable(classID,keyword, pageNumber, pageSize, sortProperty, sortDirection);
  } else {
    renderTable(classID,keyword, pageNumber, pageSize, sortProperty, sortDirection);
  }
});

//filter User for thead
table_headings.forEach((head, i) => {
  let sort_asc = true;
  head.onclick = () => {
    table_headings.forEach((head) => head.classList.remove("active"));
    head.classList.add("active");
    if (sortDirection == "ASC") sortDirection = "DESC";
    else sortDirection = "ASC";
    sortProperty = checkSortProperty(head.id);
    head.classList.toggle("asc", sort_asc);
    sort_asc = head.classList.contains("asc") ? false : true;
    renderTable(classID,keyword, pageNumber, pageSize, sortProperty, sortDirection);
  };
});

// render data in Main Table
function renderTable(classID,
  keyword,
  pageNumber,
  pageSize,
  sortProperty,
  sortDirection
) {
  // https://daotaoai.tech:59835/api/v1/studentJoin/filter
  fetch(
    "https://daotaoai.tech:59835/api/v1/studentJoin/filter" +
      "?classID=" + classID+
      "&keyword=" +
      keyword +
      "&page=" +
      pageNumber +
      "&size=" +
      pageSize +
      "&sortList=" +
      sortProperty +
      "&sortOrder=" +
      sortDirection
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((result) => {
      totalPages = result.data.totalPages;
      data = result.data.content;
      tableData.innerHTML = "";
      data.forEach((item, index) => {

        tableData.innerHTML += `<tr class="${item.mssv}">
        <td style="disabled:true;">${index + pageNumber * 5 + 1}</td>
        <td> ${item.mssv} </td>
        <td> ${item.name}</td>

        <td>
            <p class="status ${checkColorCode(
              item.code
            )}">${checkTextCode(item.code)}</p>
        </td>
        <td> ${changeTime(item.timeJoin)}</td>
        </tr> 
        `;
      });

      const rows = document.querySelectorAll(
        "#attendances_student_table__body_tableData tr"
      );
      // Add function for each row in Main Table
      // if(isReady){
        rows.forEach(function (row) {
          row.addEventListener("click", function () {
            showStudentEvidence(row.getAttribute("class"));
            popup.style.display = "block";
          });
        });
      // }
      renderPageing(classID,keyword, pageNumber, pageSize, sortProperty, sortDirection);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

//function to Show infor Student each row
async function showStudentEvidence(mssv) {
  // var studentInformation;
  await fetch("https://daotaoai.tech:59835/api/v1/evident" + "?mssv=" + mssv+"&classID=" +classID+"&page="+pageEvidence)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      tempData=data.data.content;
      item = data.data.content;
      if(!item){
        popup.style.display = "none";
        return 
      }
      document.querySelector(
        "#control_attendance_table .container_gallery"
      ).innerHTML = ` <div class="grab_lecture_view">
            <div class="grab_lecture_view_container">
         <div class="grab_lecture_view_container_part1">
            <div class="main-video-container">
               <div class="student-name">
                  <h3>Student ID: ${item[0].mssv}</h3>
               </div>
               <div>
                  <video src="${item[0].pathVideo}" loop controls id="main-video" ></video>            
                  <h3 class="main-vid-title">${item[0].title}</h3>
               </div>
            </div>
            
         </div>
         <div class="warnning-list-container">
            <div class="warnning-list-title" > 
               <h2>Warnning List</h2>
            </div>
            <div class="warnning-list-detail">    
                
            </div>
            
         </div>
      </div>
   </div>`;
   let detailList = document.querySelector(
    ".warnning-list-container .warnning-list-detail "
  );
  tempData.forEach((item, index) => {
    detailList.innerHTML += `<div class="list">
        <video src="${item.pathVideo}" class="canvas-video1" width="100" height="56"></video> 
        <div class="element">
           <div>
              <h3 class="timestamp">${changeTime(item.time)}</h3>
              <h3 class="list-title">${item.title}</h3>
           </div>
           <div>
              <i class="fa-sharp fa-solid fa-circle-exclamation"></i>
           </div>
           
        </div>
        
     </div>`;
  });

      //Popup
      const opacity = 0.5;
      // Turn off PopUp Image
      document
        .querySelector(".container_gallery")
        .addEventListener("click", (e) => {
          if (
            !document
              .querySelector(".grab_lecture_view_container")
              .contains(e.target) 
            
          )
            popup.style.display = "none";
        });
      let listDetail = document.querySelectorAll(
  ".warnning-list-container .warnning-list-detail .list "
  );
      listDetail[0].classList.add("active")
    listDetail.forEach((item) => {
      item.onclick = () => {
        let video = document.getElementById("main-video");
        listDetail.forEach((remove) => {
          remove.classList.remove("active");
        });
        item.classList.add("active");
        let title = item.querySelector(".list-title").innerHTML;
        let src = item.querySelector('.canvas-video1').src;
        document.querySelector('.main-video-container #main-video').src = src;
        document.querySelector(".main-video-container #main-video").play();
        document.querySelector(".main-video-container .main-vid-title").innerHTML =
          title;
      };
    });
    })
      
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
  
}



//check sortProperty
function checkSortProperty(thead) {
  if (thead == "_1") return "mssv";
  if (thead == "_2") return "name";
  if (thead == "_3") return "code";
  if (thead == "_4") return "timeJoin";
}

//check Color Code
function checkColorCode(code) {
  if (code == "1") return "warnning";
  if (code == "2") return "pending";
  if (code == "3") return "passed";
  if (code == "4") return "decline";
}
// check Text Code
function checkTextCode(code) {
  if (code == "1") return "Absent!";
  if (code == "2") return "Joined!";
  if (code == "3") return "Passed!";
  if (code == "4") return "Cheated!";
}

//
//Change date and time
function changeTime(time) {
  if (time == undefined) return "__________";
  var date = new Date(time);

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  var formattedDate =
    (day < 10 ? "0" + day : day) +
    "/" +
    (month < 10 ? "0" + month : month) +
    "/" +
    year;
  var formattedTime =
    (hours < 3 ? "0" + (hours + 7) : hours + 7) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (seconds < 10 ? "0" + seconds : seconds);
  return formattedDate + " " + formattedTime;
}

// Method change https->http in videoPath
function changeVideoPath(videoPath) {
  if (videoPath.includes("https://")) {
    return videoPath.replace("https://", "http://");
  } else {
    return videoPath;
  }
}
// JS for paginition
//calling function with passing parameters and adding inside element which is ul tag

const element = document.querySelector(".pagination");
function renderPageing(classID,
  keyword,
  pageNumber,
  pageSize,
  sortProperty,
  sortDirection
) {
  element.innerHTML = "";
  const ul = createPagination(
    totalPages,
    classID,
    keyword,
    pageNumber,
    pageSize,
    sortProperty,
    sortDirection
  );
  element.appendChild(ul);
}

//Press each number in Page
function createPagination(
  totalPages,
  classID,
  keyword,
  page,
  pageSize,
  sortProperty,
  sortDirection
) {
  // renderTable(keyword, page - 1, pageSize, sortProperty, sortDirection);
  const ulElement = document.createElement("ul");
  if (page > 0) {
    //show the next button if the page value is greater than 1
    const btnPrev = document.createElement("li");
    btnPrev.classList.add("btn", "prev");
    btnPrev.id = "prev1";
    btnPrev.addEventListener("click", () => {
      renderTable(classID,keyword, page - 1, pageSize, sortProperty, sortDirection);
    });
    const span = document.createElement("span");
    span.textContent = "Prev";
    btnPrev.appendChild(span);

    const icon = document.createElement("i");
    icon.classList.add("fas", "fa-angle-left");

    span.appendChild(icon);
    ulElement.appendChild(btnPrev);
  }

  if (page > 2) {
  }

  const pageWithDots = pagination(page, totalPages);
  pageWithDots.forEach((p) => {
    const event = (event) => {
      renderTable(classID,keyword, p - 1, pageSize, sortProperty, sortDirection);
    };
    const btn = createBtnPage(
      p,
      p !== "..." ? event : null,
      "numb",
      p - 1 === page ? "active" : ""
    );
    ulElement.appendChild(btn);
  });

  if (page < totalPages - 1) {
    //show the next button if the page value is less than totalPage(20)

    const btnNext = document.createElement("li");
    btnNext.classList.add("btn", "next");
    btnNext.id = "next1";
    btnNext.addEventListener("click", () => {
      renderTable(classID,keyword, page + 1, pageSize, sortProperty, sortDirection);
    });
    const span = document.createElement("span");
    span.textContent = "Next";
    btnNext.appendChild(span);

    const icon = document.createElement("i");
    icon.classList.add("fas", "fa-angle-right");
    span.appendChild(icon);
    ulElement.appendChild(btnNext);
  }
  return ulElement;
}

function createBtnPage(content, onClick, ...clazz) {
  const btn = document.createElement("li");
  clazz.filter((x) => !!x).forEach(btn.classList.add.bind(btn.classList));
  if (onClick) {
    btn.addEventListener("click", onClick);
  }
  const span = document.createElement("span");
  span.textContent = content;
  btn.appendChild(span);
  return btn;
}

function pagination(current, last) {
  var delta = 2,
    left = current - delta,
    right = current + delta + 1,
    range = [],
    rangeWithDots = [],
    l;

  for (let i = 1; i <= last; i++) {
    if (i == 1 || i == last || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}

//First render Table
const buttonStart= document.getElementById("start_check_join");
const buttonStop= document.getElementById("stop_check_join");

const loopRender= setInterval(() => {
    renderTable(classID,keyword, pageNumber, pageSize, sortProperty, sortDirection)
   },500)
buttonStart.addEventListener("click", () => {
  loopRender;
  buttonStop.style.display="block";
  buttonStart.disabled=true;

})
buttonStop.addEventListener("click", () => {
  clearInterval(loopRender);
  buttonStart.style.display="none";
  buttonStop.style.display="none";
  
  //  const rows = document.querySelectorAll(
  //       "#attendances_student_table__body_tableData tr"
  //     );
  //     // Add function for each row in Main Table
  //     // if(isReady){
  //       rows.forEach(function (row) {
  //         row.addEventListener("click", function () {
  //           showStudentEvidence(row.getAttribute("class"));
  //           popup.style.display = "block";
  //         });
  //       });
  //     // }
})

// renderTable(classID,keyword, pageNumber, pageSize, sortProperty, sortDirection);
