"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { auth } from "../../firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import logo from "/logo.jpg" // Import your logo image

export default function SignupPage() {
  const BACKEND_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://legalaid-263l.onrender.com"
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      )
      await updateProfile(userCred.user, { displayName: form.name })
      const token = await userCred.user.getIdToken()

      // Send token to backend and sync user to MongoDB
      await fetch(`${BACKEND_URL}/sync-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: form.name }),
      })

      // Get full user info from /profile
      const res = await fetch(`${BACKEND_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()

      // Save to localStorage WITH TOKEN
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data,
          token: token,
        }),
      )

      alert("Account created successfully!") // Plain text alert
      navigate("/")
    } catch (err) {
      alert("Error: " + err.message) // Plain text alert
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      {/* Background Effects */}
      <div style={styles.backgroundEffects}>
        <div style={styles.blob1}></div>
        <div style={styles.blob2}></div>
        <div style={styles.blob3}></div>
        <div style={styles.blob4}></div>
      </div>

      {/* Main Content */}
      <div style={styles.mainCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="Sahayata Logo" style={styles.logoImage} />{" "}
            {/* Replaced icon with image */}
          </div>
          <h1 style={styles.title}>Join Sahayata</h1>
          <p style={styles.subtitle}>Create your AI-powered legal assistant account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Name Field */}
          <div style={styles.inputContainer}>
            <div
              style={{
                ...styles.inputWrapper,
                ...(focusedField === "name" ? styles.inputWrapperFocused : {}),
              }}
            >
              <i className="fas fa-user" style={styles.inputIcon}></i> {/* User icon */}
              <div style={styles.inputFieldContainer}>
                <label
                  style={{
                    ...styles.floatingLabel,
                    ...(form.name || focusedField === "name" ? styles.floatingLabelActive : {}),
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField("")}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div style={styles.inputContainer}>
            <div
              style={{
                ...styles.inputWrapper,
                ...(focusedField === "email" ? styles.inputWrapperFocused : {}),
              }}
            >
              <i className="fas fa-envelope" style={styles.inputIcon}></i>{" "}
              {/* Envelope icon */}
              <div style={styles.inputFieldContainer}>
                <label
                  style={{
                    ...styles.floatingLabel,
                    ...(form.email || focusedField === "email" ? styles.floatingLabelActive : {}),
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div style={styles.inputContainer}>
            <div
              style={{
                ...styles.inputWrapper,
                ...(focusedField === "password" ? styles.inputWrapperFocused : {}),
              }}
            >
              <i className="fas fa-lock" style={styles.inputIcon}></i> {/* Lock icon */}
              <div style={styles.inputFieldContainer}>
                <label
                  style={{
                    ...styles.floatingLabel,
                    ...(form.password || focusedField === "password"
                      ? styles.floatingLabelActive
                      : {}),
                  }}
                >
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Password Requirements */}
          <div style={styles.passwordHints}>
            <div style={styles.hintItem}>
              <i className="fas fa-check-circle" style={styles.hintIcon}></i>{" "}
              {/* Checkmark circle */}
              <span style={styles.hintText}>At least 6 characters</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonLoading : {}),
            }}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)"
                e.target.style.boxShadow = "0 20px 40px rgba(0, 190, 170, 0.4)"
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)"
                e.target.style.boxShadow = "0 10px 30px rgba(0, 190, 170, 0.3)"
              }
            }}
          >
            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              <div style={styles.buttonContent}>
                <span>Create Account</span>
                <i className="fas fa-arrow-right" style={styles.buttonIcon}></i>{" "}
                {/* Arrow right for action */}
              </div>
            )}
          </button>
        </form>

        {/* Terms */}
        <div style={styles.termsContainer}>
          <p style={styles.termsText}>
            By creating an account, you agree to our{" "}
            <a href="#" style={styles.termsLink}>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" style={styles.termsLink}>
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Login Link */}
        <div style={styles.loginContainer}>
          <span style={styles.loginText}>Already have an account? </span>
          <Link to="/login" className="login-link" style={styles.loginLink}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0A192F 0%, #002B36 100%)", // Deep dark blue to darker teal/blue
    padding: "20px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  backgroundEffects: {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    zIndex: 0,
  },
  blob1: {
    position: "absolute",
    top: "-30%",
    left: "-30%",
    width: "80%",
    height: "80%",
    background: "radial-gradient(circle, rgba(0, 190, 170, 0.1) 0%, transparent 70%)", // Teal-greenish blob
    borderRadius: "50%",
    animation: "float 8s ease-in-out infinite",
  },
  blob2: {
    position: "absolute",
    top: "10%",
    right: "-40%",
    width: "90%",
    height: "90%",
    background: "radial-gradient(circle, rgba(50, 150, 180, 0.08) 0%, transparent 70%)", // Blueish blob
    borderRadius: "50%",
    animation: "float 10s ease-in-out infinite reverse",
  },
  blob3: {
    position: "absolute",
    bottom: "-40%",
    left: "10%",
    width: "70%",
    height: "70%",
    background: "radial-gradient(circle, rgba(0, 100, 100, 0.09) 0%, transparent 70%)", // Darker teal blob
    borderRadius: "50%",
    animation: "float 12s ease-in-out infinite",
  },
  blob4: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "60%",
    background: "radial-gradient(circle, rgba(0, 80, 120, 0.06) 0%, transparent 70%)", // Darker blue blob
    borderRadius: "50%",
    animation: "float 14s ease-in-out infinite reverse",
  },
  mainCard: {
    background: "rgba(18, 30, 50, 0.95)", // Slightly lighter dark blue, very subtle transparency
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "48px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 190, 170, 0.2)", // Stronger shadow, teal border glow
    border: "1px solid rgba(0, 190, 170, 0.2)", // Teal border
    position: "relative",
    zIndex: 1,
    boxSizing: "border-box", // Ensure padding doesn't increase total width
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  logoContainer: {
    marginBottom: "24px",
    display: "flex", // Use flexbox for centering
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
  },
  logoImage: {
    // Styles for the imported image
    width: "80px", // Adjust size as needed
    height: "80px", // Adjust size as needed
    objectFit: "contain", // Ensures the image scales properly within the container
    borderRadius: "20px", // Apply border-radius for consistency with original design
    boxShadow: "0 10px 30px rgba(0, 190, 170, 0.4)", // Teal shadow
    background: "linear-gradient(135deg, #00D3C3 0%, #00998F 100%)", // Brighter teal/green gradient for background of the logo, similar to the original icon's background
    padding: "10px", // Add padding around the image to give it space within the background
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#E0FFFF", // Very light cyan/white for title for maximum contrast
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#A0E6EE", // Light cyan for subtitle
    margin: 0,
    fontWeight: "400",
    lineHeight: "1.5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputContainer: {
    position: "relative",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    background: "rgba(30, 50, 70, 0.7)", // Darker blue, more opaque for input background
    border: "2px solid rgba(0, 190, 170, 0.3)", // Teal border
    borderRadius: "16px",
    padding: "4px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(10px)",
  },
  inputWrapperFocused: {
    borderColor: "#00D3C3", // Brighter teal on focus
    background: "rgba(40, 60, 80, 0.8)", // Slightly lighter blue, more opaque on focus
    boxShadow: "0 0 0 4px rgba(0, 190, 170, 0.2)", // Teal glow on focus
  },
  inputIcon: {
    // Style for Font Awesome input icons
    fontSize: "20px",
    padding: "16px",
    color: "#A0E6EE", // Light cyan for icons
  },
  inputFieldContainer: {
    flex: 1,
    position: "relative",
    padding: "8px 16px 8px 0",
  },
  floatingLabel: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "16px",
    color: "#77A7B0", // Muted blue-green for label
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    pointerEvents: "none",
    fontWeight: "500",
  },
  floatingLabelActive: {
    top: "8px",
    transform: "translateY(0)",
    fontSize: "12px",
    color: "#00D3C3", // Bright teal for active label
    fontWeight: "600",
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "16px",
    color: "#E0FFFF", // Very light cyan for input text
    paddingTop: "24px",
    paddingBottom: "8px",
    fontWeight: "500",
  },
  passwordHints: {
    // Adjusted for better layout
    display: "flex",
    flexDirection: "column", // Stack items vertically
    gap: "8px", // Smaller gap between stacked items
    marginTop: "-8px",
    // Removed flexWrap and justifyContent as items are now stacked
    paddingLeft: "20px", // Add some padding to align with input text visually
    alignItems: "flex-start", // Align hints to the left
  },
  hintItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  hintIcon: {
    // Style for Font Awesome hint icons
    fontSize: "12px",
    color: "#00D3C3", // Bright teal for hint icons
  },
  hintText: {
    fontSize: "12px",
    color: "#A0E6EE", // Light cyan for hint text
    fontWeight: "500",
  },
  submitButton: {
    background: "linear-gradient(135deg, #00D3C3 0%, #00998F 100%)", // Brighter teal gradient
    color: "#0A192F", // Dark blue text for contrast
    border: "none",
    borderRadius: "16px",
    padding: "18px 24px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 10px 30px rgba(0, 190, 170, 0.3)",
    position: "relative",
    overflow: "hidden",
    marginTop: "8px",
    width: "100%",
    boxSizing: "border-box",
  },
  submitButtonLoading: {
    cursor: "not-allowed",
    opacity: 0.8,
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  buttonIcon: {
    // Style for Font Awesome button icon
    fontSize: "16px",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    color: "#0A192F",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(10, 25, 47, 0.3)",
    borderTop: "2px solid #0A192F",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  termsContainer: {
    margin: "24px 0 16px 0",
    textAlign: "center",
  },
  termsText: {
    fontSize: "13px",
    color: "#A0E6EE",
    lineHeight: "1.5",
    margin: 0,
  },
  termsLink: {
    color: "#00D3C3",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
  loginContainer: {
    textAlign: "center",
    padding: "24px 0 0 0",
    borderTop: "1px solid rgba(0, 190, 170, 0.1)",
    marginTop: "24px",
  },
  loginText: {
    color: "#A0E6EE",
    fontSize: "16px",
  },
  loginLink: {
    color: "#00D3C3",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "16px",
    transition: "color 0.3s ease",
  },
}

// Add CSS animations and hover effects
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style")
  styleElement.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-25px) rotate(3deg); }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .social-button:hover { /* Keeping this for reference if you re-add a social button */
      border-color: #00D3C3 !important;
      background: rgba(0, 190, 170, 0.15) !important;
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }

    .terms-link:hover {
      color: #00998F !important;
      text-decoration: underline;
    }

    .login-link:hover {
      color: #00998F !important;
      text-decoration: underline;
    }

    /* Responsive adjustments for smaller screens */
    @media (max-width: 600px) {
      .mainCard {
        padding: 30px 20px !important;
      }
      .header {
        margin-bottom: 30px !important;
      }
      .logoImage { /* Target the image specifically for responsive adjustments */
        width: 60px !important;
        height: 60px !important;
        padding: 8px !important;
      }
      .title {
        font-size: 28px !important;
      }
      .subtitle {
        font-size: 15px !important;
      }
      .form {
        gap: 15px !important;
      }
      .submitButton {
        padding: 16px 20px !important;
      }
      .socialButton {
        padding: 14px !important;
      }
    }
  `
  document.head.appendChild(styleElement)
}