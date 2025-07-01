document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm")
  const nameInput = document.getElementById("name")
  const emailInput = document.getElementById("email")
  const messageInput = document.getElementById("message")
  const submitBtn = document.getElementById("submitBtn")
  const successMessage = document.getElementById("successMessage")
  const errorMessage = document.getElementById("errorMessage")

  // Email validation regex - comprehensive pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  // Error message elements
  const nameError = document.getElementById("nameError")
  const emailError = document.getElementById("emailError")
  const messageError = document.getElementById("messageError")

  // Validation functions
  function validateName(name) {
    const trimmedName = name.trim()
    if (trimmedName === "") {
      return "Name is required"
    }
    if (trimmedName.length < 2) {
      return "Name must be at least 2 characters long"
    }
    if (trimmedName.length > 50) {
      return "Name must be less than 50 characters"
    }
    // Allow letters, spaces, hyphens, apostrophes, and periods
    if (!/^[a-zA-Z\s\-'.]+$/.test(trimmedName)) {
      return "Name can only contain letters, spaces, hyphens, apostrophes, and periods"
    }
    return ""
  }

  function validateEmail(email) {
    const trimmedEmail = email.trim()
    if (trimmedEmail === "") {
      return "Email is required"
    }
    if (!emailRegex.test(trimmedEmail)) {
      return "Please enter a valid email address"
    }
    if (trimmedEmail.length > 254) {
      return "Email address is too long"
    }
    return ""
  }

  function validateMessage(message) {
    const trimmedMessage = message.trim()
    if (trimmedMessage === "") {
      return "Message is required"
    }
    if (trimmedMessage.length < 10) {
      return "Message must be at least 10 characters long"
    }
    if (trimmedMessage.length > 1000) {
      return "Message must be less than 1000 characters"
    }
    return ""
  }

  // Display error function
  function displayError(input, errorElement, errorMessage) {
    const formGroup = input.closest(".form-group")
    if (errorMessage) {
      errorElement.textContent = errorMessage
      formGroup.classList.add("error")
    } else {
      errorElement.textContent = ""
      formGroup.classList.remove("error")
    }
  }

  // Show loading state
  function setLoading(loading) {
    if (loading) {
      submitBtn.disabled = true
      submitBtn.classList.add("loading")
    } else {
      submitBtn.disabled = false
      submitBtn.classList.remove("loading")
    }
  }

  // Show message function
  function showMessage(element, show = true) {
    if (show) {
      element.classList.add("show")
      element.style.display = "flex"
      // Smooth scroll to message
      setTimeout(() => {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }, 100)
    } else {
      element.classList.remove("show")
      setTimeout(() => {
        element.style.display = "none"
      }, 300)
    }
  }

  // Handle floating label effect
  function handleFloatingLabel(input) {
    const wrapper = input.closest(".input-wrapper")
    const label = wrapper.querySelector("label")

    if (input.value.trim() !== "" || input === document.activeElement) {
      label.style.top = "8px"
      label.style.fontSize = "0.75rem"
      label.style.fontWeight = "600"
      label.style.transform = "none"
      label.style.color = "var(--border-focus)"
    } else {
      if (input.tagName === "TEXTAREA") {
        label.style.top = "20px"
        label.style.transform = "none"
      } else {
        label.style.top = "50%"
        label.style.transform = "translateY(-50%)"
      }
      label.style.fontSize = "1rem"
      label.style.fontWeight = "500"
      label.style.color = "var(--text-light)"
    }
  }
  // Real-time validation and floating labels
  ;[nameInput, emailInput, messageInput].forEach((input) => {
    // Handle floating labels
    input.addEventListener("focus", () => handleFloatingLabel(input))
    input.addEventListener("blur", () => handleFloatingLabel(input))
    input.addEventListener("input", () => {
      handleFloatingLabel(input)

      // Real-time validation
      let error = ""
      if (input === nameInput) {
        error = validateName(input.value)
        displayError(input, nameError, error)
      } else if (input === emailInput) {
        error = validateEmail(input.value)
        displayError(input, emailError, error)
      } else if (input === messageInput) {
        error = validateMessage(input.value)
        displayError(input, messageError, error)
      }
    })

    // Initialize floating labels
    handleFloatingLabel(input)
  })

  // Form submission handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Hide previous messages
    showMessage(successMessage, false)
    showMessage(errorMessage, false)

    // Get form values
    const name = nameInput.value
    const email = emailInput.value
    const message = messageInput.value

    // Validate all fields
    const nameErrorMsg = validateName(name)
    const emailErrorMsg = validateEmail(email)
    const messageErrorMsg = validateMessage(message)

    // Display errors
    displayError(nameInput, nameError, nameErrorMsg)
    displayError(emailInput, emailError, emailErrorMsg)
    displayError(messageInput, messageError, messageErrorMsg)

    // Check if form is valid
    const isValid = !nameErrorMsg && !emailErrorMsg && !messageErrorMsg

    if (isValid) {
      setLoading(true)

      try {
        // Simulate form processing (2 second delay)
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Log form data to console (frontend only)
        console.log("✅ Form submitted successfully!")
        console.log("📝 Form Data:")
        console.log("  Name:", name.trim())
        console.log("  Email:", email.trim())
        console.log("  Message:", message.trim())
        console.log("  Timestamp:", new Date().toLocaleString())

        // Show success message
        showMessage(successMessage, true)

        // Reset form with delay for better UX
        setTimeout(() => {
          form.reset()

          // Remove error states
          document.querySelectorAll(".form-group").forEach((group) => {
            group.classList.remove("error")
          })

          // Clear error messages
          nameError.textContent = ""
          emailError.textContent = ""
          messageError.textContent = ""

          // Reset floating labels
          ;[nameInput, emailInput, messageInput].forEach((input) => {
            handleFloatingLabel(input)
          })
        }, 1000)
      } catch (error) {
        console.error("❌ Error processing form:", error)
        showMessage(errorMessage, true)
      } finally {
        setLoading(false)
      }
    } else {
      // Show validation error message
      showMessage(errorMessage, true)

      // Focus on first field with error
      const firstErrorField = nameErrorMsg ? nameInput : emailErrorMsg ? emailInput : messageInput
      firstErrorField.focus()

      // Add shake animation to form
      form.style.animation = "shake 0.5s ease-in-out"
      setTimeout(() => {
        form.style.animation = ""
      }, 500)
    }
  })

  // Interactive background effects
  document.addEventListener("mousemove", (e) => {
    const shapes = document.querySelectorAll(".shape")
    const mouseX = e.clientX / window.innerWidth
    const mouseY = e.clientY / window.innerHeight

    shapes.forEach((shape, index) => {
      const speed = (index + 1) * 0.5
      const x = mouseX * speed
      const y = mouseY * speed

      shape.style.transform = `translate(${x}px, ${y}px) rotate(${x + y}deg)`
    })
  })

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      form.dispatchEvent(new Event("submit"))
    }

    // Escape to clear form
    if (e.key === "Escape") {
      if (confirm("Are you sure you want to clear the form?")) {
        form.reset()
        showMessage(successMessage, false)
        showMessage(errorMessage, false)

        // Reset all states
        document.querySelectorAll(".form-group").forEach((group) => {
          group.classList.remove("error")
        })

        nameError.textContent = ""
        emailError.textContent = ""
        messageError.textContent = ""
        ;[nameInput, emailInput, messageInput].forEach((input) => {
          handleFloatingLabel(input)
        })

        nameInput.focus()
      }
    }
  })

  // Test function for edge cases (available in console)
  window.testFormValidation = () => {
    console.log("🧪 Testing form validation...")

    console.log("📝 Empty inputs:")
    console.log("  Name:", validateName(""))
    console.log("  Email:", validateEmail(""))
    console.log("  Message:", validateMessage(""))

    console.log("📧 Invalid emails:")
    console.log("  No @:", validateEmail("testexample.com"))
    console.log("  No domain:", validateEmail("test@"))
    console.log("  No TLD:", validateEmail("test@example"))
    console.log("  With spaces:", validateEmail("test @example.com"))
    console.log("  Multiple @:", validateEmail("test@@example.com"))

    console.log("👤 Name validation:")
    console.log("  With numbers:", validateName("John123"))
    console.log("  With symbols:", validateName("John@Doe"))
    console.log("  Valid apostrophe:", validateName("O'Connor"))
    console.log("  Valid hyphen:", validateName("Mary-Jane"))
    console.log("  Valid period:", validateName("Dr. Smith"))
    console.log("  Only spaces:", validateName("   "))

    console.log("📏 Length validation:")
    console.log("  Short message:", validateMessage("Hi"))
    console.log("  Long name:", validateName("A".repeat(51)))
    console.log("  Long email:", validateEmail("a".repeat(250) + "@example.com"))

    console.log("🔤 Special characters:")
    console.log("  Name with unicode:", validateName("José María"))
    console.log("  Email with plus:", validateEmail("test+tag@example.com"))
    console.log("  Message with newlines:", validateMessage("Line 1\nLine 2\nLine 3"))

    console.log("✅ All validation tests completed!")
  }

  // Initialize
  console.log("🎨 Beautiful Contact Form loaded!")
  console.log("💡 Try typing 'testFormValidation()' in console to test all edge cases")
  console.log("⌨️  Keyboard shortcuts:")
  console.log("   • Ctrl/Cmd + Enter: Submit form")
  console.log("   • Escape: Clear form")
})

</merged_code>
