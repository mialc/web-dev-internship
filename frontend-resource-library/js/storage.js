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
