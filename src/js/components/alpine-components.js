export const form = () => ({
  name: "",
  nameError: null,
  email: "",
  emailError: null,
  about: "",
  aboutError: null,
  isPrivacy: null,

  loading: false,
  success: false,

  validateEmail() {
    if (this.email === "") {
      this.emailError = null;
      return false;
    }

    if (this.email.length < 3) {
      this.emailError = "Email too short";
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(this.email)) {
      this.emailError = null;
      return true;
    } else {
      this.emailError = "Please provide a correct email";
      return false;
    }
  },

  validateName(onBlur = false) {
    if (!this.name) {
      this.nameError = null;
      return false;
    }

    if (this.name.length < 3) {
      if (onBlur) {
        this.nameError = "Please provide a correct name";
      }
      return false;
    }

    this.nameError = null;
    return true;
  },

  validateText() {
    if (this.about.length === 0) return;

    if (this.about.length >= 20) {
      this.aboutError = null;
      return true;
    } else {
      this.aboutError = `Too short. Add ${20 - this.about.length} more characters`;
      return false;
    }
  },

  validateForm() {
    return this.validateName() && this.validateEmail() && this.validateText() && this.isPrivacy;
  },

  async submitForm(e) {
    if (!this.validateForm()) {
      return;
    }
    this.loading = true;

    const formData = new FormData(e.target);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        this.success = true;
        this.name = "";
        this.email = "";
        this.about = "";
        this.isPrivacy = false;
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  },
});
