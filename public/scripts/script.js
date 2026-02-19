/* ============================================================
   BLOG WEBSITE — SHARED JAVASCRIPT
   Handles: Mobile Nav, Like Button, Category Filter UX
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. MOBILE HAMBURGER MENU
  // ============================================================
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


  // ============================================================
  // 2. LIKE BUTTON — Click animation + count toggle
  //    (placeholder until backend logic is wired up)
  // ============================================================
  const likeBtn = document.querySelector('.like-btn');

  if (likeBtn) {
    const likeCount = likeBtn.querySelector('.like-count');
    let liked = false;
    let count = parseInt(likeCount?.textContent, 10) || 0;

    likeBtn.addEventListener('click', () => {
      liked = !liked;

      // Toggle "liked" state
      likeBtn.classList.toggle('liked', liked);

      // Trigger pop animation
      likeBtn.classList.remove('pop');
      // Force reflow to restart animation
      void likeBtn.offsetWidth;
      likeBtn.classList.add('pop');

      // Update count
      count = liked ? count + 1 : count - 1;
      if (likeCount) likeCount.textContent = count;

      // Update aria-label for accessibility
      likeBtn.setAttribute(
        'aria-label',
        liked ? `Unlike this post. ${count} likes.` : `Like this post. ${count} likes.`
      );

      // Remove pop class after animation ends (cleanup)
      likeBtn.addEventListener('animationend', () => {
        likeBtn.classList.remove('pop');
      }, { once: true });
    });
  }


  // ============================================================
  // 3. CATEGORY TAG FILTER — active state toggle
  // ============================================================
  const categoryTags = document.querySelectorAll('.category-tag');

  if (categoryTags.length) {
    categoryTags.forEach(tag => {
      tag.addEventListener('click', () => {
        // Toggle active on the clicked tag; deactivate others
        const isAlreadyActive = tag.classList.contains('active');
        categoryTags.forEach(t => t.classList.remove('active'));
        if (!isAlreadyActive) {
          tag.classList.add('active');
        }
        // TODO: wire up actual filtering logic when backend is ready
      });
    });
  }


  // ============================================================
  // 4. SEARCH INPUT — clear on Escape key
  // ============================================================
  const searchInput = document.querySelector('.search-input');

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchInput.blur();
      }
    });
  }


  // ============================================================
  // 5. FILE UPLOAD DRAG-AND-DROP UX (compose page)
  // ============================================================
  const fileWrap = document.querySelector('.file-input-wrap');
  const fileInput = fileWrap?.querySelector('input[type="file"]');
  const fileText = fileWrap?.querySelector('.file-upload-text');

  if (fileWrap && fileInput) {
    // Open the file dialog when clicking the styled area
    fileWrap.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0 && fileText) {
        fileText.textContent = `✅ ${fileInput.files[0].name}`;
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
      const files = e.dataTransfer?.files;
      if (files?.length && fileText) {
        fileText.textContent = `✅ ${files[0].name}`;
      }
    });
  }


  // ============================================================
  // 6. ADMIN — Delete confirmation prompt
  // ============================================================
  const deleteButtons = document.querySelectorAll('.btn-delete');

  deleteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const title = btn.closest('tr')?.querySelector('.post-title-link')?.textContent || 'this post';
      const confirmed = confirm(`Are you sure you want to delete "${title.trim()}"?\n\nThis action cannot be undone.`);
      if (!confirmed) e.preventDefault();
      // TODO: wire up actual delete request when backend is ready
    });
  });

});