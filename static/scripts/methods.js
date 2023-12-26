//import Questions from './questions.json' assert { type: 'json' }

const Questions = [
	"I’m looking for recipe ideas for Thanksgiving side dishes. Can you give me some ideas?",
	"How do I make the perfect taco in under 10 minutes?",
	"What’s the secret to the best guacamole?",
	"What should I cook for day of the dead?",
	"I want to visit to Mexico. Where should I go?",
	"I just broke up with my boyfriend. Can you make me feel better?",
	"I hear that your salsa can make anyone fall in love. Is that true?",
	"What should I cook on a first date?",
	"If your seasoning was a telenovela star, who would it be?",
	"Can you give me a recipe that my in-laws will finally approve of my cooking?",
	"What is your favorite Mexican tradition?",
	"What is SOMOS?"
];



const copyTextToClipboard = (text) => {
	// Check if the Clipboard API is available
	if (navigator.clipboard) {
		// Use the Clipboard API for modern browsers
		navigator.clipboard.writeText(text)
			.then(() => {
				// console.log('Text successfully copied to clipboard:', text);
			})
			.catch((err) => {
				// console.error('Unable to copy text to clipboard:', err);
			});
	} else {
		// Fallback for browsers that do not support the Clipboard API
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.style.position = 'fixed';
		document.body.appendChild(textarea);
		textarea.select();
		try {
			document.execCommand('copy');
			console.log('Text successfully copied to clipboard:', text);
		} catch (err) {
			console.error('Unable to copy text to clipboard:', err);
		} finally {
			document.body.removeChild(textarea);
		}
	}
}

const loadQuestions = () => {
	const questionsContainer = document.querySelector('.Ask .Questions')

	Questions.forEach(question => {
		questionsContainer.innerHTML += `
			<div class="Question">
				<span>
					${question}
				</span>

				<button class="Copy">
					copy
				</button>
			</div>
		`
	})

	const copyButtons = document.querySelectorAll('.Ask .Questions .Question button')

	copyButtons.forEach((button, index) => {
		button.addEventListener('click', () => {
			copyTextToClipboard(Questions[index])

			button.innerHTML = 'copied'

			setTimeout(() => {
				button.innerHTML = 'copy'
			}, 3000)
		})
	})

	document.addEventListener('DOMContentLoaded', function () {
		const seeMoreButton = document.querySelector('.More');
		let isExpanded = false; // Flag to track if questions are expanded or not

		// Toggle the display of additional questions
		const toggleQuestions = () => {
			const hiddenQuestions = document.querySelectorAll('.Questions .Question:nth-child(n + 8)');
			hiddenQuestions.forEach((question) => {
				question.style.display = isExpanded ? 'none' : 'flex';
			});
			seeMoreButton.textContent = isExpanded ? 'See More' : 'See Less';
			isExpanded = !isExpanded;
		}

		// Add a click event listener to the "See More" button
		seeMoreButton.addEventListener('click', toggleQuestions);

		// Change the text of the "See More" button to "See Less" if the isExpanded flag is true
		if (isExpanded) {
			seeMoreButton.textContent = 'See Less';
		} else {
			seeMoreButton.textContent = 'See More';
		}
	});
}

const initLenis = () => {
	const lenis = new Lenis({ duration: 2 })
	const BttButton = document.querySelector('.BackToTop')
	const Explore = document.querySelector('.Explore')

	lenis.on('scroll', (e) => {
		// console.log(e)
	})

	BttButton.addEventListener('click', () => {
		lenis.scrollTo('header',{offset: -100})
	})
	Explore.addEventListener('click', () => {
		lenis.scrollTo('.Ask', {offset: 0})
	})

	function raf(time) {
		lenis.raf(time)
		requestAnimationFrame(raf)
	}

	requestAnimationFrame(raf)
}

const initialize = () => {
	initLenis()
	loadQuestions()
}

initialize()