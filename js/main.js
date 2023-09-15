const elList = document.querySelector(".list");
const table = document.querySelector("table");
const elSelect = document.querySelector("select");
const elRegionInput = document.querySelector(".js-input");
const elRegionList = document.querySelector(".js-search-list");
const elForm = document.querySelector(".js-form");
const elLabel = document.querySelector(".position-relative");
const elTime = document.querySelector(".js-time");
const elTimeLeft = document.querySelector(".js-time-left");
const fragmentElements = document.createDocumentFragment();


function updateTime() {
  const currentDate = new Date();

  const month = currentDate.getMonth();
  const monthName = months[month];
  const day = currentDate.getDate().toString().padStart(2, 0);
  const hour = currentDate.getHours().toString().padStart(2, 0);
  const minutes = currentDate.getMinutes().toString().padStart(2, 0);
  const seconds = currentDate.getSeconds().toString().padStart(2, 0);

  elTime.textContent = `
  ${day} ${monthName} ${hour}-${minutes}-${seconds}
  `
  elTime.setAttribute("datetime", `${currentDate.getFullYear()}-${(month+1).toString().padStart(2, 0)}-${day}T${hour}:${minutes}:${seconds}`);
}

setInterval(updateTime, 500)


elRegionList.classList.add("d-none")

async function renderDay(data) {
  await data;
  elList.innerHTML = ""
  if(elList.classList.contains("d-none")) {
    elList.classList.remove("d-none")
  }
  table.classList.add("d-none");
  elList.innerHTML = `
  <li class="d-flex bg-dark justify-content-between text-white p-3 rounded-3 ">
  <strong>Bomdod</strong> ${data.times.tong_saharlik}
  </li>
  </li>
  <li class="d-flex bg-dark justify-content-between text-white p-3 rounded-3 ">
  <strong>Quyosh</strong> ${data.times.quyosh}
  </li>
  <li class="d-flex bg-dark justify-content-between text-white p-3 rounded-3 ">
  <strong>Peshin</strong> ${data.times.peshin}
  </li>
  <li class="d-flex bg-dark justify-content-between text-white p-3 rounded-3 ">
  <strong>Asr</strong> ${data.times.asr}
  </li>
  <li class="d-flex bg-dark justify-content-between text-white p-3 rounded-3 ">
  <strong>Shom_iftor</strong> ${data.times.shom_iftor}
  </li>
  <li class="d-flex bg-dark justify-content-between text-white p-3 rounded-3 ">
  <strong>Hufton</strong> ${data.times.hufton}
  </li>`
}
async function renderWeek(data) {
  table.innerHTML = ""
  table.innerHTML = `
  <thead>
  <tr class="table-dark">
  <th>Hafta kunlari</th>
  <td>Bomdod</td>
  <td>Quyosh</td>
  <td>Peshin</td>
  <td>Asr</td>
  <td>Shom</td>
  <td>Xufton</td>
  </tr>
  </thead>`
  if(table.classList.contains("d-none")) {
    table.classList.remove("d-none")
  }
  elList.classList.add("d-none");
  const tableBodyElement = document.createElement("tbody");
  table.appendChild(tableBodyElement);
  data.forEach(item => {
    const trElement = document.createElement("tr");
    const thElement = document.createElement("th");
    thElement.textContent = item.weekday;
    for (const element in item.times) {
      const tdElement = document.createElement("td");
      tdElement.textContent = item.times[element]
      trElement.append(tdElement);
    }
    trElement.prepend(thElement);
    tableBodyElement.append(trElement)
  });
}
async function renderMonth(data) {
  table.innerHTML = ""
  table.innerHTML = `<thead>
  <tr class=""table-dark>
  <th>Hafta kunlari</th>
  <td>Bomdod</td>
  <td>Quyosh</td>
  <td>Peshin</td>
  <td>Asr</td>
  <td>Shom</td>
  <td>Xufton</td>
  </tr>
  </thead>`
  if(table.classList.contains("d-none")) {
    table.classList.remove("d-none")
  }
  elList.classList.add("d-none");
  const tableBodyElement = document.createElement("tbody");
  table.appendChild(tableBodyElement);
  data.forEach(item => {
    const trElement = document.createElement("tr");
    const thElement = document.createElement("th");
    thElement.textContent = `${item.weekday}(${item.date.slice(0, 10)})`;
    for (const element in item.times) {
      const tdElement = document.createElement("td");
      tdElement.textContent = item.times[element]
      trElement.append(tdElement);
    }
    trElement.prepend(thElement);
    tableBodyElement.append(trElement)
  });
}

async function getData(url, type) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if(type == "Day") renderDay(data, elList);
    if(type == "Week") renderWeek(data, table);
    if(type == "Month") renderMonth(data, table);
  } catch (error) {
    console.log(error);
  }
}

getData("https://islomapi.uz/api/present/day?region=Toshkent", "Day")

elSelect.addEventListener("change", () => {
  if(elSelect.value == "Day") {
    getData("https://islomapi.uz/api/present/day?region=Toshkent", "Day")
  }
  if(elSelect.value == "Week") {
    getData("https://islomapi.uz/api/present/week?region=Toshkent", "Week")
  }
  if(elSelect.value == "Month") {
    getData("https://islomapi.uz/api/monthly?region=Toshkent&month=4", "Month");
  }
})

function renderRegions(data, node) {
  node.innerHTML = "";
  if(data.length) {
    elRegionList.classList.remove("d-none")
    data.forEach(item => {
      const liElement = document.createElement("li");
      liElement.classList.add("js-search-item", "list-group-item", "list-group-item-action",  "bg-dark-subtle", "text-warning-emphasis", "border-dark");
      liElement.textContent = item;
      fragmentElements.appendChild(liElement);
    })
    elRegionList.appendChild(fragmentElements);
    elRegionInput.setAttribute("style", "border-bottom-left-radius:0")
    elLabel.classList.add("remover-border");
  }
}

elRegionInput.addEventListener("keyup", () => {
  let elRegionInputValue = elRegionInput.value.trim().toLowerCase();
  
  // uppercasing the first character of input
  elRegionInput.value = elRegionInputValue.slice(0, 1).toUpperCase() + elRegionInputValue.slice(1);
  
  const findedRegions = regions.filter(item => {
    const lowerCaseItem = item.toLowerCase();
    const removeSymbolItem = lowerCaseItem.replace("'", "");
    
    if(elRegionInputValue.includes("'")) {
      return lowerCaseItem.includes(elRegionInputValue);
    }
    
    return removeSymbolItem.includes(elRegionInputValue)
  })
  renderRegions(findedRegions, elRegionList);
})

document.body.addEventListener("click", evt => {
  if(!evt.target.matches(".list-group-item")) {
    elRegionList.classList.add("d-none");
    elLabel.classList.remove("remover-border");
    elRegionInput.setAttribute("style", "border-bottom-left-radius:inherit");
  }
  if(evt.target.matches(".js-input")) {
    const loweredValue = elRegionInput.value.toLowerCase();
    
    if(elRegionInput.value) {
      const findedRegions = regions.filter(item => {
        const lowerCaseItem = item.toLowerCase();
        
        return lowerCaseItem.includes(loweredValue)
      })
      renderRegions(findedRegions, elRegionList)
    } else {
      renderRegions(regions, elRegionList);
    }
  }
})

elRegionList.addEventListener("click", evt => {
  elRegionInput.value = evt.target.innerHTML;
  if(elRegionInput.textContent) {
    elRegionList.classList.add("d-none")
  }

  getData("https://islomapi.uz/api/present/week?region=Toshkent", "Week")
  getData("https://islomapi.uz/api/monthly?region=Toshkent&month=4", "Month");


  if(elSelect.value === "Day") getData(`https://islomapi.uz/api/present/day?region=${elRegionInput.value}`, elSelect.value);
  if(elSelect.value === "Week") getData(`https://islomapi.uz/api/present/week?region=${elRegionInput.value}`, elSelect.value);
  if(elSelect.value === "Month") getData(`https://islomapi.uz/api/monthly?region=${elRegionInput.value}`, elSelect.value);
})


elForm.addEventListener("submit", evt => {
  evt.preventDefault()
  console.log(elSelect.value);

  getData(`https://islomapi.uz/api/present/day?region=${elRegionInput.value}`, "Day");
})
