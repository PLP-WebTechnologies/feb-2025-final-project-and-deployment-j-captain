    document.addEventListener('DOMContentLoaded', function() {
    // Hero Section Animation
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.classList.add('loaded');
        
        // Additional hover effect controls if needed
        hero.addEventListener('mouseenter', () => {
            // You can add additional JS-controlled animations here
        });
        
        hero.addEventListener('mouseleave', () => {
            // Reset animations if needed
        });
    }

    // Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Responsive adjustments
    function handleResize() {
        if (window.innerWidth > 768 && navLinks) {
            navLinks.classList.remove('active');
        }
    }
    window.addEventListener('resize', handleResize);

    // Handle sponsorship form submission
    const sponsorForm = document.getElementById('sponsorForm');
    if (sponsorForm) {
        sponsorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            // Simple validation
            if (name.length < 15 || !email.includes('@')) {
                alert('Please fill in all required fields correctly');
                return;
            }

            // Here you would typically send this data to a server
            alert(`Thank you ${name} for your application! We'll contact you at ${email}.`);
            
            // Reset the form
            sponsorForm.reset();
        });
    }

    // Initial resize handler
    handleResize();
});


// Team photo animation handler
document.querySelectorAll('.team-photo').forEach(photo => {
    // Click handler for counter-clockwise rotation
    photo.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent any default behavior
        
        // Remove active class if it exists
        this.classList.remove('active');
        
        // Trigger reflow to restart animation
        void this.offsetWidth;
        
        // Add active class to start animation
        this.classList.add('active');
    });
    
    // Remove class after animation completes
    photo.addEventListener('animationend', function() {
        this.classList.remove('active');
    });
});


document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('expandedImage');
  const closeBtn = document.querySelector('.close-btn');
  const confirmClose = document.getElementById('confirmClose');
  const cancelClose = document.getElementById('cancelClose');
  const confirmationDialog = document.querySelector('.confirmation-dialog');

  // Click handler for team photos
  document.querySelectorAll('.team-photo').forEach(photo => {
    photo.addEventListener('click', function() {
      // Counter-clockwise rotation
      this.classList.remove('active');
      void this.offsetWidth;
      this.classList.add('active');
      
      // Open modal after rotation completes
      setTimeout(() => {
        modal.style.display = 'block';
        modalImg.src = this.src;
        modalImg.alt = this.alt;
      }, 800); // Match rotation duration
    });
  });



  
// // Click handler for Opening Card Images
//   document.querySelectorAll('.card-img').forEach(photo => {
//     photo.addEventListener('click', function() {
      
//        {
//         modal.style.display = 'block';
//         modalImg.src = this.src;
//         modalImg.alt = this.alt;
//       } 
//     });
//   });


  // Close button handler
  closeBtn.addEventListener('click', function() {
    // Rotate the close button
    this.style.animation = 'spinClose 0.5s';
    
    // Show confirmation after rotation
    setTimeout(() => {
      confirmationDialog.style.display = 'block';
      this.style.animation = '';
    }, 500);
  });

  // Confirmation buttons
  confirmClose.addEventListener('click', function() {
    modal.style.display = 'none';
    confirmationDialog.style.display = 'none';
  });

  cancelClose.addEventListener('click', function() {
    confirmationDialog.style.display = 'none';
  });

  // Close modal when clicking outside image
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      confirmationDialog.style.display = 'none';
    }
  });
});

/* Dynamic year script */
 
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Make copyright clickable to reload page
    document.querySelector('.copyright p').addEventListener('click', function() {
        window.location.reload();
    });


    // Injury Card
//     document.querySelectorAll('.injury-card').forEach(card => {
//   const cardInner = card.querySelector('.card-inner');
  
//   card.addEventListener('mousemove', (e) => {
//     const xAxis = (card.offsetWidth / 2 - (e.pageX - card.offsetLeft)) / 25;
//     const yAxis = (card.offsetHeight / 2 - (e.pageY - card.offsetTop)) / 25;
    
//     cardInner.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
//   });
  
//   card.addEventListener('mouseleave', () => {
//     cardInner.style.transform = 'rotateY(0) rotateX(0)';
//   });
// });
 