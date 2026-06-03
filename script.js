// ===== Active Navigation Link Highlighting =====
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Add Animation on Scroll =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe venture cards, feature items, project cards, and forum cards
document.querySelectorAll('.venture-card, .feature-item, .project-card, .forum-card, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== Makerslite Lab Forum =====
function initForum() {
    const forumList = document.getElementById('forum-list');
    const questionForm = document.getElementById('question-form');

    if (!forumList || !questionForm) {
        return;
    }

    const storageKey = 'makersliteLabForum';
    const savedData = JSON.parse(localStorage.getItem(storageKey) || '[]');
    let forumData = Array.isArray(savedData) ? savedData : [];

    function saveForumData() {
        localStorage.setItem(storageKey, JSON.stringify(forumData));
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function renderForum() {
        if (!forumData.length) {
            forumList.innerHTML = '<p class="empty-state">No questions yet. Be the first to ask something.</p>';
            return;
        }

        forumList.innerHTML = forumData.map((question, index) => {
            const answersHtml = question.answers.map(answer => `
                <div class="answer-item">
                    <strong>${answer.author}</strong> <span>(${formatDate(answer.created)})</span>
                    <p>${answer.text}</p>
                </div>
            `).join('');

            return `
                <div class="forum-card" data-question-index="${index}">
                    <h3>${question.topic}</h3>
                    <div class="forum-meta">Asked by ${question.author} • ${formatDate(question.created)}</div>
                    <div class="forum-text">${question.text}</div>
                    <button class="answer-toggle btn btn-secondary">Answer this question</button>
                    <div class="answer-list">
                        ${answersHtml || '<p class="empty-state">No answers yet. Be the first to respond.</p>'}
                    </div>
                    <form class="answer-form" data-question-index="${index}" style="display:none;">
                        <textarea required placeholder="Write your answer..."></textarea>
                        <input type="text" placeholder="Your name" required>
                        <button type="submit" class="btn btn-primary">Submit Answer</button>
                    </form>
                </div>
            `;
        }).join('');

        forumList.querySelectorAll('.answer-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.forum-card');
                const form = card.querySelector('.answer-form');
                form.style.display = form.style.display === 'none' ? 'grid' : 'none';
            });
        });

        forumList.querySelectorAll('.answer-form').forEach(form => {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                const questionIndex = Number(form.getAttribute('data-question-index'));
                const textarea = form.querySelector('textarea');
                const nameInput = form.querySelector('input[type="text"]');

                if (!textarea.value.trim() || !nameInput.value.trim()) {
                    return;
                }

                const answer = {
                    author: nameInput.value.trim(),
                    text: textarea.value.trim(),
                    created: Date.now()
                };

                forumData[questionIndex].answers.push(answer);
                saveForumData();
                renderForum();
            });
        });
    }

    questionForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const authorInput = document.getElementById('q-author');
        const topicInput = document.getElementById('q-topic');
        const textInput = document.getElementById('q-text');

        const question = {
            author: authorInput.value.trim() || 'Anonymous',
            topic: topicInput.value.trim(),
            text: textInput.value.trim(),
            created: Date.now(),
            answers: []
        };

        if (!question.topic || !question.text) {
            return;
        }

        forumData.unshift(question);
        saveForumData();
        renderForum();
        questionForm.reset();
    });

    renderForum();
}

initForum();

// ===== Mobile Menu Toggle (if needed in future) =====
function setupMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    // Create a mobile menu button if navbar contains many items
    if (navbar && navLinks) {
        // This can be extended for true mobile menu functionality
        console.log('Mobile menu system ready');
    }
}

setupMobileMenu();

// ===== Console Welcome Message =====
console.log('%c🚀 Welcome to Ventures of Sachin Sridharan!', 'font-size: 16px; font-weight: bold; color: #1e40af;');
console.log('%cExploring the future of innovation through Hardware & AI', 'font-size: 12px; color: #7c3aed;');
