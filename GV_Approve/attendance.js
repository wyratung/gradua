var totalPages;
var pageNumber = 0;
const pageSize = 5;
var keyword = "";
var sortDirection = "ASC";
var sortProperty = "timeSelfie";
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
    renderTable(keyword, pageNumber, pageSize, sortProperty, sortDirection);
  } else {
    renderTable(keyword, pageNumber, pageSize, sortProperty, sortDirection);
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
    renderTable(keyword, pageNumber, pageSize, sortProperty, sortDirection);
  };
});

// render data in Main Table
function renderTable(
  keyword,
  pageNumber,
  pageSize,
  sortProperty,
  sortDirection
) {
  fetch(
    "https://daotaoai.tech:59835/api/v1/studentImages/filter" +
      "?keyword=" +
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
        <td> ${changeTime(item.timeSelfie)}</td>
        <td> ${changeTime(item.timeApprove)}</td>
        <td>
            <p class="status ${checkColorCode(
              item.approveCode
            )}">${checkTextCode(item.approveCode)}</p>
        </td>
        <td>
        <img src="${item.portraitImage}" width="300" height="400">
            </img>
            </td>
        </tr> 
        `;
      });

      const rows = document.querySelectorAll(
        "#attendances_student_table__body_tableData tr"
      );
      // Add function for each row in Main Table
      rows.forEach(function (row) {
        row.addEventListener("click", function () {
          showInforStudent(row.getAttribute("class"));
          popup.style.display = "block";
        });
      });
      renderPageing(keyword, pageNumber, pageSize, sortProperty, sortDirection);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

//function to Show infor Student each row
async function showInforStudent(mssv) {
  // var studentInformation;
  await fetch("https://daotaoai.tech:59835/api/v1/studentImages/" + mssv)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // studentInformation = data.data;
      item = data.data;
      document.querySelector(
        "#control_attendance_table .container_gallery"
      ).innerHTML = `<div class="container_gallery_wrapper">
            <div class="container_gallery_wrapper_infor">
                <div>
                    <div>MSSV : ${item.mssv}</div>
                    <div>Admin : ${item.inforTA}</div>
                </div>
                <div>
                    <div>Time Take Photos : ${changeTime(item.timeSelfie)}</div>
                    <div>Time Approve : ${changeTime(item.timeApprove)}</div>
                </div>
            </div>
            <button id="container_gallery_exit_popup">X</button>
            <div class="panel-main">
                <img src="${item.listImages[0]}" id="selected">
            </div>

            <div class="thumbs">
                <img src="${item.listImages[0]}">
                <img src="${item.listImages[1]}">
                <img src="${item.listImages[2]}">
                <img src="${item.listImages[3]}">
                <img src="${item.listImages[4]}">
            </div>
            <div class="container_gallery_wrapper_handle_image">
                <button class="custom-btn refuse_image ">Decline!</button>
                <button class="custom-btn approve_image ">Approve!</button>
            </div>
        </div>
        <div class="container_gallery_note_wapper">
            <div class="paper">
                <div class="holes"></div>
                <textarea placeholder="Note Here ...">${item.note}</textarea>
            </div>
        </div>`;
      //Popup
      const currentImage = document.querySelector("#selected");
      const thumbs = document.querySelectorAll(".thumbs img");
      const opacity = 0.5;
      // Turn off PopUp Image
      document
        .getElementById("container_gallery_exit_popup")
        .addEventListener("click", () => (popup.style.display = "none"));
      document
        .querySelector(".container_gallery")
        .addEventListener("click", (e) => {
          if (
            !document
              .querySelector(".container_gallery_wrapper")
              .contains(e.target) &
            !document
              .querySelector(".container_gallery_note_wapper")
              .contains(e.target)
          )
            popup.style.display = "none";
        });
      thumbs[0].style.opacity = opacity;
      thumbs.forEach((img) => img.addEventListener("click", imgActivate));
      function imgActivate(e) {
        thumbs.forEach((img) => (img.style.opacity = 1));
        currentImage.src = e.target.src;
        currentImage.classList.add("fade-in");
        setTimeout(() => currentImage.classList.remove("fade-in"), 500);
        e.target.style.opacity = opacity;
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
  //get data of Note
  noteData = document.querySelector(
    ".container_gallery_note_wapper .paper textarea"
  );
  // Change User Code Approve t0 Approve
  document
    .querySelector("button.custom-btn.approve_image")
    .addEventListener("click", () => {
      handleStudentImages(mssv, "Test", "3", "OK!");
      popup.style.display = "none";
      // setTimeout(window.location.reload(), 1000);
    });
  // Change User Code Approve t0 Decline
  document
    .querySelector("button.custom-btn.refuse_image")
    .addEventListener("click", () => {
      handleStudentImages(mssv, "Test", "4", noteData.value);
      popup.style.display = "none";
    });
}

// Method change Code Approve
async function handleStudentImages(mssv, inforTA, approveCode, note) {
  await fetch("https://daotaoai.tech:59810/save_database/" + mssv, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin":"*",
      // "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*"
    },
    body: JSON.stringify({
      mssv: mssv,
      approveCode: approveCode,
      inforTA: inforTA,
      timeApprove: new Date(),
      note: note,
    }),
  })
    .then((response) => {
    //  response.headers.set("Content-type", "application/json");
    // response.headers.set("Access-Control-Allow-Origin", "*");
    // response.headers.set("Access-Control-Allow-Headers", "*");
    //     response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      window.location.reload();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

//check sortProperty
function checkSortProperty(thead) {
  if (thead == "_1") return "mssv";
  if (thead == "_2") return "timeSelfie";
  if (thead == "_3") return "timeApprove";
  if (thead == "_4") return "approveCode";
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
  if (code == "1") return "No Images";
  if (code == "2") return "Pending";
  if (code == "3") return "Passed";
  if (code == "4") return "Decline";
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

// JS for paginition
//calling function with passing parameters and adding inside element which is ul tag

const element = document.querySelector(".pagination");
function renderPageing(
  keyword,
  pageNumber,
  pageSize,
  sortProperty,
  sortDirection
) {
  element.innerHTML = "";
  const ul = createPagination(
    totalPages,
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
      renderTable(keyword, page - 1, pageSize, sortProperty, sortDirection);
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
      renderTable(keyword, p - 1, pageSize, sortProperty, sortDirection);
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
      renderTable(keyword, page + 1, pageSize, sortProperty, sortDirection);
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

//Forrt render Table
renderTable(keyword, pageNumber, pageSize, sortProperty, sortDirection);
