window.frsh_init().then(function (client) {
  client.instance.context().then(function (context) {
    console.log(context.data);
    let attachmentDiv = document.querySelector(".card");
    let dateOrder = new Date(context.data[0].created_at).toDateString();
    let counter = 0;
    console.log("dateOrder", dateOrder);
    attachmentDiv.innerHTML = context.data
      .map((element) => {
        if (dateOrder === new Date(element.created_at).toDateString()) {
          console.log(
            dateOrder === new Date(element.created_at).toDateString()
          );
          counter += 1;
          return templateCard(element, counter);
        } else {
          dateOrder = new Date(element.created_at).toDateString();
          counter = 1;
          return templateCard(element, counter);
        }
      })
      .join("");
  }),
    function (error) {
      console.error(error);
    };
  event.preventDefault();
});

function templateCard(element, counter) {
  return `
  <p style="color:#183247; text-align:right; margin-top:14px;"><b>${
    counter - 1 === 0 ? new Date(element.created_at).toDateString() : ""
  }</b></p>
  <div>
  </div>
    <div class="attachment-details-name" id="attachment-detail" style="display:flex; justify-content:space-between">
        <div>
            <p>${element.name}</p>
            <p>${bytesToSize(element.size)}</p>
        </div>
        <a href=${element.attachment_url} target="_blank">
          <fw-icon name="download" size="18"></fw-icon>
        </a>
        </div>
        `;
}

function bytesToSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "n/a";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes} ${sizes[i]})`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

// function addListeners() {
//   console.log("-----------------------------------------------------he;;");
//   console.log(context1);

//   console.log("-----------------------------------------------------he;;");
// }
