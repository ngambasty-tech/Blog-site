document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile Navigation ──
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile nav when a link inside it is clicked
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (
        mobileNav.classList.contains('open') &&
        !mobileNav.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Like Button Functionality ──
  const likeBtn = document.querySelector('.like-btn');

  if (likeBtn) {
    const likeCount = likeBtn.querySelector('.like-count');
    let liked = false;
    let count = parseInt(likeCount?.textContent, 10) || 0;

    likeBtn.addEventListener('click', () => {
      liked = !liked;

      likeBtn.classList.toggle('liked', liked);

      likeBtn.classList.remove('pop');
      void likeBtn.offsetWidth;
      likeBtn.classList.add('pop');

      count = liked ? count + 1 : count - 1;
      if (likeCount) likeCount.textContent = count;

      likeBtn.setAttribute(
        'aria-label',
        liked ? `Unlike this post. ${count} likes.` : `Like this post. ${count} likes.`
      );

      likeBtn.addEventListener('animationend', () => {
        likeBtn.classList.remove('pop');
      }, { once: true });
    });
  }

  // ── Search & Filter Functionality ──
  const filterForm = document.getElementById('filterForm');
  const searchInput = document.querySelector('.search-input');
  const categoryButtons = document.querySelectorAll('.category-tag');
  const pageLinks = document.querySelectorAll('.pagination a');
  
  if (filterForm) {
    // Debounced search (waits for user to stop typing)
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          // Reset to page 1 when searching
          const pageInput = document.getElementById('pageInput');
          if (pageInput) pageInput.value = 1;
          filterForm.submit();
        }, 500); // Wait 500ms after user stops typing
      });

      // Handle Escape key to clear search
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchInput.value = '';
          // Clear search and submit
          const pageInput = document.getElementById('pageInput');
          if (pageInput) pageInput.value = 1;
          filterForm.submit();
        }
      });
    }

    // Handle category tag clicks
    if (categoryButtons.length) {
      categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault(); // Prevent default button behavior
          
          // Get the category value
          const category = button.getAttribute('value') || button.textContent.trim();
          
          // Find or create hidden category input
          let categoryInput = document.querySelector('input[name="category"]');
          if (!categoryInput) {
            categoryInput = document.createElement('input');
            categoryInput.type = 'hidden';
            categoryInput.name = 'category';
            filterForm.appendChild(categoryInput);
          }
          
          // Set category value
          categoryInput.value = category;
          
          // Reset to page 1
          const pageInput = document.getElementById('pageInput');
          if (pageInput) pageInput.value = 1;
          
          // Submit the form
          filterForm.submit();
        });
      });
    }

    // Preserve filter state in pagination links
    if (pageLinks.length) {
      pageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          // Don't prevent default - let the browser navigate normally
          // The server will handle the URL parameters
        });
      });
    }
  }

  // ── Category Tag Active State (for initial load) ──
  // This complements the server-side active state
  if (categoryButtons.length && !filterForm) {
    // Only run this if we're not using the form submission method
    categoryButtons.forEach(tag => {
      tag.addEventListener('click', () => {
        const isAlreadyActive = tag.classList.contains('active');
        categoryButtons.forEach(t => t.classList.remove('active'));
        if (!isAlreadyActive) {
          tag.classList.add('active');
        }
      });
    });
  }

  // ── File Upload Functionality (Admin) ──
  const fileWrap = document.querySelector('.file-input-wrap');
  const fileInput = fileWrap?.querySelector('input[type="file"]');
  const fileText = fileWrap?.querySelector('.file-upload-text');

  if (fileWrap && fileInput) {
    // Open the file dialog when clicking the styled area
    fileWrap.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0 && fileText) {
        fileText.textContent = `✅ ${fileInput.files[0].name}`;
      } else if (fileText) {
        fileText.textContent = 'Choose an image or drag it here';
      }
    });

    // Drag-and-drop styling
    ['dragenter', 'dragover'].forEach(evt => {
      fileWrap.addEventListener(evt, (e) => {
        e.preventDefault();
        fileWrap.style.borderColor = 'var(--color-accent)';
        fileWrap.style.background = 'var(--color-accent-soft)';
      });
    });

    ['dragleave', 'drop'].forEach(evt => {
      fileWrap.addEventListener(evt, (e) => {
        e.preventDefault();
        fileWrap.style.borderColor = '';
        fileWrap.style.background = '';
      });
    });

    fileWrap.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = e.dataTransfer?.files;
      if (files?.length && fileInput) {
        // Set the file input's files
        fileInput.files = files;
        if (fileText) {
          fileText.textContent = `✅ ${files[0].name}`;
        }
      }
    });
  }

  // ── Delete Confirmation (Admin) ──
  const deleteButtons = document.querySelectorAll('.btn-delete');

  deleteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const title = btn.closest('tr')?.querySelector('.post-title-link')?.textContent || 'this post';
      const confirmed = confirm(`Are you sure you want to delete "${title.trim()}"?\n\nThis action cannot be undone.`);
      if (!confirmed) e.preventDefault();
    });
  });

  // ── Optional: Add smooth scrolling for pagination ──
  const paginationLinks = document.querySelectorAll('.pagination a');
  paginationLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Optional: Add a loading state or smooth scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });

  // ── Optional: Show loading state when searching/filtering ──
  if (filterForm) {
    filterForm.addEventListener('submit', () => {
      // You could add a loading spinner here
      // For example, add a class to body or show a loading overlay
      document.body.classList.add('loading');
    });
  }

});