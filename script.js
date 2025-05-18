// Smooth scroll for anchor links (if any)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Optional: Auto-rotate testimonials (basic logic)
let currentTestimonial = 0;
const testimonials = document.querySelectorAll(".testimonial");

function rotateTestimonials() {
  testimonials.forEach((t, i) => {
    t.style.display = i === currentTestimonial ? "block" : "none";
  });
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
}

if (testimonials.length > 1) {
  rotateTestimonials(); // show the first one
  setInterval(rotateTestimonials, 4000); // rotate every 4 seconds
}
function handleClick() {
  alert("Thank you for your interest! We’ll get back to you soon.");
}