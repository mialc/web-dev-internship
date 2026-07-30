// reused by project.js, skills.js, timeline.js, and main.js (focus text), each with their own key string, instead of
// writing the same save/load/clear functions four separate times

// localStorage only stores strings, so JSON.stringify() turns wtv data is passed in into a string first
function saveData(key, data) {
   localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
   const saved = localStorage.getItem(key);
   // getItem() returns null if nothing has been saved yet under that key
   return saved === null ? null : JSON.parse(saved);
   // JSON.parse() turns a saved string back into the real array/object/string
}

// wipes whatever was saved under that key
function clearData(key) 
{
   localStorage.removeItem(key);
}
