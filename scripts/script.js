const issueContainer = document.getElementById('issue-container');



async function loadIssues() {
  try {
    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
    const data = await res.json();
    allIssues = data.data;

    displayIssues(data);
  } catch (error) {
    console.error("Error fetching issues:", error);
    issueContainer.innerHTML = "<p class='text-red-500'>Failed to load issues.</p>";
  }
}

 
  function handleIssueFilters() {

  const allBtn = document.getElementById("all-btn");
  const openBtn = document.getElementById("open-btn");
  const closedBtn = document.getElementById("closed-btn");

  allBtn.addEventListener("click", () => {
    displayIssues({ data: allIssues });
    setActiveButton(allBtn)
  });

  openBtn.addEventListener("click", () => {
    const openIssues = allIssues.filter(issue => issue.status.toLowerCase() === "open");
    displayIssues({ data: openIssues });
    setActiveButton(openBtn);
  });

  closedBtn.addEventListener("click", () => {
    const closedIssues = allIssues.filter(issue => issue.status.toLowerCase() === "closed");
    displayIssues({ data: closedIssues });
    setActiveButton(closedBtn);
  });

}


  function setActiveButton(activeBtn) {

  const allBtn = document.getElementById("all-btn");
  const openBtn = document.getElementById("open-btn");
  const closedBtn = document.getElementById("closed-btn");

  const buttons = [allBtn, openBtn, closedBtn];

  buttons.forEach(btn => {
    btn.classList.remove("btn-primary");
  });

  activeBtn.classList.add("btn-primary");
}
 
  handleIssueFilters();



function displayIssues(issueObj) {
  
    updateIssueCount(issueObj);

  const issues = issueObj.data; 
  issueContainer.innerHTML = ''; 
  
  issues.forEach(issue => {
    const statusColor = issue.status.toLowerCase() === 'open' ? 'bg-emerald-500' : 'bg-purple-500'; 
    const card = document.createElement("div");
    card.className = 'card bg-base-100 shadow-sm border border-gray-100 rounded-md overflow-hidden flex flex-col justify-between cursor-pointer';
     card.onclick = () => loadCardDetail(issue.id);
    card.innerHTML = `
    <div class="h-1.5 ${statusColor} w-full"></div>
      <div class="p-4 flex flex-col gap-3">
        <div class="flex justify-between items-center">
           <img src="${getStatusIcon(issue.status)}" alt="${issue.status}" class="w-5 h-5">
          <span class="badge ${getPriorityColor(issue.priority)} font-bold text-[10px] py-1 px-2 uppercase">
          ${issue.priority}
        </span>
        </div>
        <h2 class="line-clamp-1 text-md font-bold text-gray-800">${issue.title}</h2>
        <p class="text-gray-500 text-sm line-clamp-2">${issue.description}</p>
        <div class="flex flex-wrap gap-2 mt-2">
          ${issue.labels.map(label => `<span class="badge bg-orange-50 text-orange-500 border-orange-100 text-[10px] py-1 px-2">${label}</span>`).join('')}
        </div>
      </div>
      <div class="px-4 py-3 border-t border-gray-100 bg-white text-xs text-gray-500">
        <div class="flex justify-between">
          <span>#${issue.id} by <b>${issue.author}</b></span>
          <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    `;
    issueContainer.appendChild(card);
  });
}


function getPriorityColor(priority) {
  switch (priority.toUpperCase()) {
    case 'HIGH':
      return 'bg-red-50 text-red-500 border-red-100';
    case 'MEDIUM':
      return 'bg-yellow-50 text-yellow-500 border-yellow-100';
    case 'LOW':
      return 'bg-gray-50 text-gray-500 border-gray-100';
    default:
      return 'bg-gray-50 text-gray-500 border-gray-100';
  }
}

function getStatusIcon(status) {
  const s = status.toLowerCase(); 
  if (s === 'open') return 'assets/Open-Status.png';
  if (s === 'closed') return 'assets/Closed-Status .png';
 
}



function updateIssueCount(issueObj) {
  const issueCount = document.getElementById("issue-count");
  const issues = issueObj.data;
  issueCount.textContent = `${issues.length} issues`;
};


const loadCardDetail = async (id) => {
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayCardDetails(details.data);
}
const displayCardDetails = (issue) => {
  console.log(issue);
  const detailsBox = document.getElementById('details-container');
  detailsBox.innerHTML = `
  
       <h2 class="text-2xl font-bold text-gray-800">
      ${issue.title}
    </h2>

    
    <div class="flex items-center gap-3 mt-3 text-sm text-gray-500">
     <span class="badge ${issue.status.toLowerCase() === 'open' ? 'badge-success' : 'bg-purple-500 text-white'} text-white px-3 py-2">
          ${issue.status}
      </span>
      <span>•</span>
      <span>Opened by <b>${issue.author}</b></span>
      <span>•</span>
      <span>${issue.createdAt}</span>
    </div>

    
    <div class="flex gap-2 mt-4">
      <span class="badge badge-outline border-red-300 text-red-500">BUG</span>
      <span class="badge badge-outline border-orange-300 text-orange-500">HELP WANTED</span>
    </div>

    
    <p class="mt-6 text-gray-600 leading-relaxed">
      ${issue.description}
    </p>

    
    <div class="grid grid-cols-2 gap-6 mt-8 bg-base-200 p-6 rounded-xl">

      <div>
        <p class="text-sm text-gray-500">Assignee:</p>
        <p class="font-semibold text-gray-800 mt-1">${issue.author}</p>
      </div>

      <div>
        <p class="text-sm text-gray-500">Priority:</p>
       <span class="badge ${getPriorityColor(issue.priority)} mt-1">${issue.priority}</span>
      </div>

    </div>
  
  `;
  document.getElementById('my_modal_5').showModal()
}



loadIssues();

document.getElementById('btn-search')
  .addEventListener('click', () =>{
    const input = document.getElementById('input-search');
    const searchValue = input.value.trim().toLowerCase();
    console.log(searchValue)

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchValue}`)
      .then((res) => res.json())
      .then((data) => {
        const allSearch = data.data;
        console.log(allSearch);
        const filterSearch = allSearch.filter((issue) => 
         issue.title.toLowerCase().includes(searchValue)
      
      )
      // console.log(filterSearch);
      displayIssues({ data: filterSearch });
      
      })

  })