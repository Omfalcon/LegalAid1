"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase"
import { useNavigate } from "react-router-dom"
import logo from "/logo.jpg" // Import your logo image

export default function LoginPage() {
  const BACKEND_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://legalaid-263l.onrender.com"
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const userCred = await signInWithEmailAndPassword(auth, form.email, form.password)
      const token = await userCred.user.getIdToken()
      console.log("Firebase Auth Token:", token)

      const res = await fetch(`${BACKEND_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data.name,
          email: data.email,
          uid: data.uid,
          token: token,
        }),
      )

      alert("Logged in as " + data.name)
      navigate("/")
    } catch (err) {
      alert("Error: " + err.message)
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
        <div style={styles.blob4}></div> {/* Added blob4 for consistency with signup */}
      </div>

      {/* Main Content */}
      <div style={styles.mainCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="Sahayata Logo" style={styles.logoImage} />{" "}
            {/* Replaced icon with image */}
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your Sahayata account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email Field */}
          <div style={styles.inputContainer}>
            <div
              style={{
                ...styles.inputWrapper,
                ...(focusedField === "email" ? styles.inputWrapperFocused : {}),
              }}
            >
              <i className="fas fa-envelope" style={styles.inputIcon}></i>{" "}
              {/* Font Awesome icon */}
              <div style={styles.inputFieldContainer}>
                <label
                  style={{
                    ...styles.floatingLabel,
                    ...(form.email || focusedField === "email"
                      ? styles.floatingLabelActive
                      : {}),
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
              <i className="fas fa-lock" style={styles.inputIcon}></i>{" "}
              {/* Font Awesome icon */}
              <div style={styles.inputFieldContainer}>
                <label
                  style={{
                    ...styles.floatingLabel,
                    ...(form.password || focusedField === "password"
                      ? styles.floatingLabelActive
                      : {}),
                  }}
                >
                  Password
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
                e.target.style.boxShadow = "0 20px 40px rgba(0, 190, 170, 0.4)" // Teal shadow
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)"
                e.target.style.boxShadow = "0 10px 30px rgba(0, 190, 170, 0.3)" // Teal shadow
              }
            }}
          >
            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <div style={styles.buttonContent}>
                <span>Sign In</span>
                <i className="fas fa-sign-in-alt" style={styles.buttonIcon}></i>{" "}
                {/* Sign-in icon */}
              </div>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div style={styles.signupContainer}>
          <span style={styles.signupText}>Don't have an account? </span>
          <Link to="/signup" className="signup-link" style={styles.signupLink}>
            Create Account
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
    maxWidth: "480px", // Adjusted max-width to match signup
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
  logoImage: { // Styles for the imported image
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
    gap: "20px", // Adjusted gap to match signup
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
  forgotPassword: {
    textAlign: "right",
    marginTop: "-8px",
  },
  forgotLink: {
    color: "#00D3C3", // Bright teal
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
  submitButton: {
    background: "linear-gradient(135deg, #00D3C3 0%, #00998F 100%)", // Brighter teal gradient
    color: "#0A192F", // Dark blue text for contrast
    border: "none",
    borderRadius: "16px",
    padding: "18px 24px",
    fontSize: "16px",
    fontWeight: "700", // Bolder text
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 10px 30px rgba(0, 190, 170, 0.3)", // Teal shadow
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
    // Added for consistent button icon styling
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  buttonIcon: {
    // Added for consistent button icon styling
    fontSize: "16px",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    color: "#0A192F", // Dark blue text for loading
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(10, 25, 47, 0.3)", // Dark blue for spinner border
    borderTop: "2px solid #0A192F", // Dark blue for spinner top
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "32px 0",
    gap: "16px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background:
      "linear-gradient(90deg, transparent 0%, rgba(0, 190, 170, 0.1) 50%, transparent 100%)", // Teal tint
  },
  dividerText: {
    color: "#77A7B0", // Muted blue-green
    fontSize: "14px",
    fontWeight: "500",
  },
  socialContainer: {
    marginBottom: "24px",
  },
  socialButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "16px",
    border: "2px solid rgba(0, 190, 170, 0.3)", // Teal border
    borderRadius: "16px",
    background: "rgba(30, 50, 70, 0.7)", // Darker blue background
    color: "#E0FFFF", // Light cyan text
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    boxShadow: "none", // Resetting for consistency with signup page's social button (if any)
  },
  socialIcon: {
    fontSize: "20px",
    color: "#A0E6EE", // Light cyan icon color
  },
  signupContainer: {
    textAlign: "center",
    padding: "24px 0 0 0",
    borderTop: "1px solid rgba(0, 190, 170, 0.1)", // Subtle teal border top
  },
  signupText: {
    color: "#A0E6EE", // Light cyan
    fontSize: "16px",
  },
  signupLink: {
    color: "#00D3C3", // Bright teal
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

    .forgot-link:hover {
      color: #00998F !important; /* Darker teal on hover */
      text-decoration: underline;
    }

    .signup-link:hover {
      color: #00998F !important; /* Darker teal on hover */
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