// openPasswordTab buttons
openPasswordTab = document.getElementById("openPasswordTab");
passwordTab = document.getElementById("passwordTab");
closePasswordTab = document.getElementById("closePasswordTab");
function openPasswordTabFunction() {
  passwordTab.style.left = "0%"
  console.log("Opened passwordTab");
  console.log("Loaded");
  chrome.storage.local.get("finished_setup", ({finished_setup}) => {
    console.log('Value currently is ' + finished_setup);
    if (finished_setup) {
      tabLock.style.display = "none";
    } else {
      tabLock.style.display = "block";
    };
  });
}
function closePasswordTabFunction() {
  passwordTab.style.left = "100%";
  console.log("Closed passwordTab");
}
openPasswordTab.addEventListener("click", async () => {
  openPasswordTabFunction();
});
closePasswordTab.addEventListener("click", async () => {
  closePasswordTabFunction();
});

// openBookmarkTab buttons
openBookmarkTab = document.getElementById("openBookmarkTab");
bookmarkTab = document.getElementById("bookmarkTab");
closeBookmarkTab = document.getElementById("closeBookmarkTab");
function openBookmarkTabFunction() {
  bookmarkTab.style.left = "0%"
  console.log("Opened bookmarkTab");
}
function closeBookmarkTabFunction() {
  bookmarkTab.style.left = "100%";
  console.log("Closed bookmarkTab");
}
openBookmarkTab.addEventListener("click", async () => {
  openBookmarkTabFunction();
});
closeBookmarkTab.addEventListener("click", async () => {
  closeBookmarkTabFunction();
});

// closeBookmarkFolderTab button]
closeBookmarkFolderTab = document.getElementById("closeBookmarkFolderTab");
bookmarkFolderViewTab = document.getElementById("bookmarkFolderViewTab");
closeBookmarkFolderTab.addEventListener("click", async () => {
  bookmarkFolderViewTab.style.left = "100%";
});
