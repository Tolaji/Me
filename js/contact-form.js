// Sends the contact form through Web3Forms without leaving the page.
(function () {
  var form = document.querySelector(".cf-form");
  if (!form) return;

  var button = form.querySelector(".cf-submit");
  var status = form.querySelector(".cf-status");
  var keyField = form.querySelector('input[name="access_key"]');
  var nameField = form.querySelector('input[name="name"]');
  var idleLabel = button.textContent;

  function show(kind, message) {
    status.textContent = message;
    status.className = "cf-status is-" + kind;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var key = keyField ? keyField.value.trim() : "";
    if (!key || key.indexOf("YOUR_") === 0) {
      show("error", "This form is not set up to send yet. Please email me directly instead.");
      return;
    }

    // Web3Forms uses "name" for the sender, so combine the two name fields
    nameField.value = (
      form.elements["first-name"].value +
      " " +
      form.elements["last-name"].value
    ).trim();

    button.disabled = true;
    button.textContent = "Sending...";
    show("info", "Sending your message...");

    fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok && data.success, data: data };
        });
      })
      .then(function (result) {
        if (result.ok) {
          form.reset();
          show("success", "Thank you! Your message has been sent and I will get back to you soon.");
        } else {
          show("error", (result.data && result.data.message) || "Something went wrong. Please try again.");
        }
      })
      .catch(function () {
        show("error", "Could not reach the mail service. Check your connection and try again.");
      })
      .then(function () {
        button.disabled = false;
        button.textContent = idleLabel;
      });
  });
})();
