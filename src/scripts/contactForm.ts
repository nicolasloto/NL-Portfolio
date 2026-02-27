export function initContactForm(): void {
  const form = document.getElementById("contact-form");
  if (!(form instanceof HTMLFormElement)) return;

  const nameInput = form.querySelector("#name");
  const emailInput = form.querySelector("#email");
  const emailSuggestions = form.querySelector("#email-suggestions");
  const messageInput = form.querySelector("#message");
  const feedback = form.querySelector("#contact-feedback");
  const submitBtn = form.querySelector('button[type="submit"]');

  if (!(nameInput instanceof HTMLInputElement)) return;
  if (!(emailInput instanceof HTMLInputElement)) return;
  if (!(messageInput instanceof HTMLTextAreaElement)) return;
  if (!(submitBtn instanceof HTMLButtonElement)) return;
  const idleLabel = submitBtn.dataset.idleLabel || "Send Message";
  const loadingLabel = submitBtn.dataset.loadingLabel || "Sending...";

  const setFeedback = (
    text = "",
    tone: "normal" | "ok" | "error" = "normal"
  ) => {
    if (!(feedback instanceof HTMLElement)) return;
    feedback.textContent = text;
    feedback.classList.remove("text-white/80", "text-emerald-300", "text-rose-300");
    feedback.setAttribute("aria-live", tone === "error" ? "assertive" : "polite");
    if (tone === "ok") feedback.classList.add("text-emerald-300");
    else if (tone === "error") feedback.classList.add("text-rose-300");
    else feedback.classList.add("text-white/80");
  };

  const setNameMessage = () => {
    if (nameInput.validity.valueMissing) {
      nameInput.setCustomValidity("Please enter your name.");
    } else if (nameInput.validity.tooShort || nameInput.validity.patternMismatch) {
      nameInput.setCustomValidity("Use 2-120 valid characters for your name.");
    } else {
      nameInput.setCustomValidity("");
    }
  };

  const setEmailMessage = () => {
    if (emailInput.validity.valueMissing) {
      emailInput.setCustomValidity("Please enter your email.");
    } else if (emailInput.validity.typeMismatch) {
      emailInput.setCustomValidity("Please enter a valid email address.");
    } else {
      emailInput.setCustomValidity("");
    }
  };

  const updateEmailSuggestions = () => {
    if (!(emailSuggestions instanceof HTMLElement)) return;
    const value = emailInput.value.trim();
    const hasAt = value.includes("@");
    const [localPart, domainPart] = value.split("@");
    const show = Boolean(localPart) && (!hasAt || !domainPart);
    emailSuggestions.classList.toggle("hidden", !show);
    emailSuggestions.classList.toggle("flex", show);
  };

  const applyDomainSuggestion = (domain: string) => {
    const value = emailInput.value.trim();
    const localPart = value.split("@")[0]?.trim();
    if (!localPart) return;
    emailInput.value = `${localPart}@${domain}`;
    emailInput.focus();
    emailInput.setSelectionRange(emailInput.value.length, emailInput.value.length);
    setEmailMessage();
    updateEmailSuggestions();
  };

  const setMessageText = () => {
    if (messageInput.validity.valueMissing) {
      messageInput.setCustomValidity("Please add a message.");
    } else if (messageInput.validity.tooShort) {
      messageInput.setCustomValidity("Message must be at least 10 characters.");
    } else {
      messageInput.setCustomValidity("");
    }
  };

  nameInput.addEventListener("input", setNameMessage);
  emailInput.addEventListener("input", () => {
    setEmailMessage();
    updateEmailSuggestions();
  });
  emailInput.addEventListener("blur", updateEmailSuggestions);
  messageInput.addEventListener("input", setMessageText);

  if (emailSuggestions instanceof HTMLElement) {
    emailSuggestions.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const button = target.closest("button[data-domain]");
      if (!(button instanceof HTMLButtonElement)) return;
      const domain = button.dataset.domain;
      if (!domain) return;
      applyDomainSuggestion(domain);
    });
  }

  form.addEventListener("submit", async (event) => {
    setNameMessage();
    setEmailMessage();
    setMessageText();

    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
      return;
    }

    event.preventDefault();
    setFeedback("Sending message...");
    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-70", "cursor-not-allowed");
    submitBtn.textContent = loadingLabel;
    form.setAttribute("aria-busy", "true");

    try {
      const body = new URLSearchParams(new FormData(form) as any);
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body,
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok && data?.ok) {
        setFeedback("Message sent successfully.", "ok");
        form.reset();
        updateEmailSuggestions();
      } else if (response.status === 400) {
        setFeedback("Please complete all required fields correctly.", "error");
      } else {
        const requestId = typeof data?.requestId === "string" ? ` [ref: ${data.requestId}]` : "";
        setFeedback(`Unable to send message right now. Please try again.${requestId}`, "error");
      }
    } catch {
      setFeedback("Network error. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
      submitBtn.textContent = idleLabel;
      form.setAttribute("aria-busy", "false");
    }
  });

  updateEmailSuggestions();
}
