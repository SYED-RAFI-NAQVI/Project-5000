document.onreadystatechange = function () {
  addListeners();

  if (document.readyState === "interactive") renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(handleErr);

    function getClient(_client) {
      window.client = _client;
      client.events.on("app.activated", onAppActivate);
    }
  }
};

let dataConv = [];
function addListeners() {
  document
    .getElementById("modal-button")
    .addEventListener("click", function () {
      client.interface.trigger("showModal", {
        title: "Attachments",
        template: "./components/modal.html",
        data: dataConv || {},
      });
    });
}

function onAppActivate() {
  dataConv = [];
  async function attachmentsData() {
    await client.data
      .get("ticket")
      .then(
        function (data) {
          data.ticket.attachments.map((item) => dataConv.push(item));
          return data;
        },
        function (error) {
          console.log("error of app", error);
        }
      )
      .then((data) => {
        client.request
          .get(
            `https://newaccount1633193479620.freshdesk.com/api/v2/tickets/${data.ticket.id}/conversations`,
            {
              headers: {
                Authorization: "Basic <%= encode(iparam.freshdesk_api_key) %>",
                "Content-Type": "application/json",
              },
            }
          )
          .then(
            function (convData) {
              JSON.parse(convData.response).map((item) => {
                if (item.attachments < 1) {
                  dataConv.push(item.attachments);
                } else {
                  item.attachments.map((i) => dataConv.push(i));
                }
              });
              console.log("dataConv", dataConv);
              return dataConv;
            },
            function (error) {
              console.error("Conversation Error::", error);
            }
          );
      });
  }
  attachmentsData();
}

function handleErr(err) {
  console.error(`Error occured. Details:`, err);
}
