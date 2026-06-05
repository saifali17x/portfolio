// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all critical functionality
  initializeNavigation();
  initializeMobileMenu();
  initializeThemeToggle();
  initializeScrollEffects();
  initializeForms();
  initializeAnimations();
  initializeKeyboardAccessibility();

  // Preload only critical images (e.g., hero image)
  const heroImg = document.querySelector(".hero-image img");
  if (heroImg && heroImg.src) {
    const img = new Image();
    img.src = heroImg.src;
  }
});

// Defer non-critical features to window load
window.addEventListener("load", function () {
  handleImageErrors();
  initializePerformanceMonitoring();
});

// Smooth scrolling for navigation links
function initializeNavigation() {
  try {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // Close mobile menu when link is clicked
          const navLinksContainer = document.querySelector(".nav-links");
          const mobileToggle = document.querySelector(".mobile-menu-toggle");
          if (navLinksContainer && mobileToggle) {
            navLinksContainer.classList.remove("active");
            mobileToggle.classList.remove("active");
            document.body.style.overflow = "";
          }
        }
      });
    });
  } catch (error) {
    // Optionally log error
  }
}

// Mobile menu functionality
function initializeMobileMenu() {
  try {
    const mobileToggle = document.querySelector(".mobile-menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!mobileToggle || !navLinks) return;

    // Handle click and keyboard events for mobile toggle
    const toggleMenu = function () {
      mobileToggle.classList.toggle("active");
      navLinks.classList.toggle("active");

      // Prevent body scroll when menu is open
      if (navLinks.classList.contains("active")) {
        document.body.style.overflow = "hidden";
        // Focus first menu item for accessibility
        const firstMenuItem = navLinks.querySelector("a");
        if (firstMenuItem) {
          setTimeout(() => firstMenuItem.focus(), 100);
        }
      } else {
        document.body.style.overflow = "";
        // Return focus to toggle button
        mobileToggle.focus();
      }
    };

    mobileToggle.addEventListener("click", toggleMenu);

    // Handle keyboard navigation for mobile toggle
    mobileToggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("active");
        mobileToggle.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Close menu on window resize
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        navLinks.classList.remove("active");
        mobileToggle.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  } catch (error) {
    console.warn("Mobile menu initialization failed:", error);
  }
}

// Theme toggle functionality
function initializeThemeToggle() {
  try {
    const themeToggle = document.querySelector(".theme-toggle");
    if (!themeToggle) return;

    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Update toggle button state
    updateThemeToggleState(savedTheme);

    themeToggle.addEventListener("click", function () {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeToggleState(newTheme);

      // Add smooth transition animation
      document.body.style.transition = "all 0.3s ease";
      setTimeout(() => {
        document.body.style.transition = "";
      }, 300);
    });

    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", function (e) {
        if (!localStorage.getItem("theme")) {
          const theme = e.matches ? "dark" : "light";
          document.documentElement.setAttribute("data-theme", theme);
          updateThemeToggleState(theme);
        }
      });
    }
  } catch (error) {
    console.warn("Theme toggle initialization failed:", error);
  }
}

// Update theme toggle button state
function updateThemeToggleState(theme) {
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }
}

// Navbar scroll effects
function initializeScrollEffects() {
  try {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    function handleScroll() {
      const scrolled = window.scrollY;
      if (scrolled > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }

    window.addEventListener("scroll", handleScroll);

    // Parallax effect for hero section (desktop only)
    if (window.innerWidth > 768) {
      const heroCircle = document.querySelector(".hero-circle");
      if (heroCircle) {
        window.addEventListener("scroll", function () {
          const scrolled = window.pageYOffset;
          const translateY = scrolled * 0.3;
          heroCircle.style.transform = `translateY(${translateY}px)`;
        });
      }
    }
  } catch (error) {}
}

// Form handling
function initializeForms() {
  try {
    // Contact form submission handler
    const contactForm = document.querySelector(".contact-form form");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        handleContactForm(this);
      });
    }

    // Newsletter form submission handler
    const newsletterForm = document.querySelector(".newsletter-form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();
        handleNewsletterForm(this);
      });
    }

    // Resume download button handler
    const downloadBtn = document.querySelector(".cta-button");
    if (downloadBtn && downloadBtn.textContent.includes("Download Resume")) {
      downloadBtn.addEventListener("click", function (e) {
        e.preventDefault();
        handleResumeDownload();
      });
    }
  } catch (error) {}
}

// Contact form handler
function handleContactForm(form) {
  try {
    const nameInput = form.querySelector('input[placeholder="Name"]');
    const emailInput = form.querySelector('input[placeholder="Email"]');
    const messageInput = form.querySelector('textarea[placeholder="Message"]');

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const message = messageInput ? messageInput.value.trim() : "";

    if (!name || !email || !message) {
      showMessage("Please fill in all fields.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    const submitBtn = form.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
      showMessage(
        "Thank you for your message! I'll get back to you soon.",
        "success"
      );
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  } catch (error) {
    showMessage("Error sending message. Please try again.", "error");
  }
}

// Newsletter form handler
function handleNewsletterForm(form) {
  try {
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput ? emailInput.value.trim() : "";

    if (!email) {
      showMessage("Please enter your email address.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    const submitBtn = form.querySelector("button");
    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Subscribing...";
    submitBtn.disabled = true;

    // Simulate subscription
    setTimeout(() => {
      showMessage(
        "Thank you for subscribing to TechNotes! Check your email for confirmation.",
        "success"
      );
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  } catch (error) {
    showMessage("Error subscribing. Please try again.", "error");
  }
}

// Resume download handler
function handleResumeDownload() {
  try {
    const link = document.createElement("a");
    link.href = "./Saif-Ali-Resume.pdf";
    link.download = "Saif_Ali_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showMessage("Resume download initiated!", "success");
  } catch (error) {
    showMessage("Error downloading resume. Please try again later.", "error");
  }
}

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show message function
function showMessage(message, type = "info") {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = message;

  const colors = {
    success: "#4CAF50",
    error: "#f44336",
    info: "#2196F3",
  };

  messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;

  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 300);
  }, 4000);
}

// Intersection Observer for scroll animations
function initializeAnimations() {
  try {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
      ".project-card, .value-item, .hero-text, .hero-image, .about-images, .about-text"
    );

    animatedElements.forEach((el) => {
      el.classList.add("animate-init");
      observer.observe(el);
    });
  } catch (error) {}
}

// Keyboard accessibility
function initializeKeyboardAccessibility() {
  try {
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (document.activeElement) {
          document.activeElement.blur();
        }
      }
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-navigation");
      }
    });

    document.addEventListener("mousedown", function () {
      document.body.classList.remove("keyboard-navigation");
    });

    // Add CSS for keyboard navigation if not already present
    if (!document.querySelector("#keyboard-styles")) {
      const focusStyle = document.createElement("style");
      focusStyle.id = "keyboard-styles";
      focusStyle.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(300px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(300px); opacity: 0; }
                }
                
                .keyboard-navigation *:focus {
                    outline: 2px solid #003f7f;
                    outline-offset: 2px;
                }

                .keyboard-navigation .nav-links a:focus,
                .keyboard-navigation .cta-button:focus,
                .keyboard-navigation .newsletter-form button:focus,
                .keyboard-navigation .submit-btn:focus {
                    outline: 2px solid #f4d03f;
                    outline-offset: 2px;
                }
            `;
      document.head.appendChild(focusStyle);
    }
  } catch (error) {}
}

// Performance monitoring
function initializePerformanceMonitoring() {
  try {
    if ("performance" in window) {
      window.addEventListener("load", function () {
        setTimeout(function () {
          const perfData = performance.getEntriesByType("navigation")[0];
          if (perfData) {
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            if (loadTime > 3000) {
              // Optionally log slow load
            }
          }
        }, 0);
      });
    }
  } catch (error) {}
}

// Error handling for images
function handleImageErrors() {
  try {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.addEventListener("error", function () {
        // Optionally set a fallback image here
      });
    });
  } catch (error) {}
}

// Responsive parallax reset
window.addEventListener("resize", function () {
  try {
    const heroCircle = document.querySelector(".hero-circle");
    if (heroCircle && window.innerWidth <= 768) {
      heroCircle.style.transform = "translateY(0)";
    }
  } catch (error) {}
});

// Utility function to safely query elements
function safeQuerySelector(selector) {
  try {
    return document.querySelector(selector);
  } catch (error) {
    console.warn(`Failed to query selector: ${selector}`, error);
    return null;
  }
}

// Utility function to safely query multiple elements
function safeQuerySelectorAll(selector) {
  try {
    return document.querySelectorAll(selector);
  } catch (error) {
    console.warn(`Failed to query selector: ${selector}`, error);
    return [];
  }
}

// Export functions for potential use elsewhere
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    isValidEmail,
    showMessage,
    safeQuerySelector,
    safeQuerySelectorAll,
  };
}
