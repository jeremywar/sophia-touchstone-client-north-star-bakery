// Initialize Form Element Variables
let nameValid = true, emailValid = true, detailsValid = true;
let isValid = false;
const contactForm = document.querySelector('form');
// Only Run these Scripts if on the Contact Form
if (contactForm) {
	const namefield = contactForm.elements['name'];
	const emailfield = contactForm.elements['email'];
	const requestTypeRadios = Array.from(document.querySelectorAll('input[type=radio]'));
	const requestDetailsLabel = document.getElementById('request-details-label');
	const requestDetails = contactForm.elements['request_details'];
	const preorderRequestFields = document.getElementById('preorder-specific-fields');
	const allergyNotes = contactForm.elements['allergy_notes'];
	const pickupDate = contactForm.elements['pickup_date'];

	// Load Contact Form Values from Session Storage
	const sessionNameField = sessionStorage.getItem('namefield');
	const sessionEmailField = sessionStorage.getItem('emailfield');
	const sessionRequestType = sessionStorage.getItem('requestType');
	const sessionRequestDetails = sessionStorage.getItem('requestDetails');
	const sessionAllergyNotes = sessionStorage.getItem('allergyNotes');
	const sessionPickupDate = sessionStorage.getItem('pickupDate');
	if (sessionNameField) {
		namefield.value = sessionNameField;
		validateRequiredFields(namefield);
	}
	if (sessionEmailField) {
		emailfield.value = sessionEmailField;
		validateRequiredFields(emailfield);
	}
	if (sessionRequestType) {
		let selectedRadio = requestTypeRadios.find(radio => radio.value === sessionRequestType);
		selectedRadio.setAttribute('checked', true);
		if (sessionRequestType == 'preorder') { toggleRequestFields(selectedRadio) }
	}
	if (sessionRequestDetails) {
		requestDetails.value = sessionRequestDetails;
		validateRequiredFields(requestDetails);
	}
	if (sessionAllergyNotes) {
		allergyNotes.value = sessionAllergyNotes;
	}
	if (sessionPickupDate) {
		pickupDate.value = sessionPickupDate;
	}

	// Save Contact Form Values to Session Storage
	function saveFormToSession() {
		let radioSelection = requestTypeRadios.find(radio => radio.checked == true);
		sessionStorage.setItem('namefield', namefield.value);
		sessionStorage.setItem('emailfield', emailfield.value);
		sessionStorage.setItem('requestType', radioSelection ? radioSelection.value : '');
		sessionStorage.setItem('requestDetails', requestDetails.value);
		sessionStorage.setItem('allergyNotes', allergyNotes.value);
		sessionStorage.setItem('pickupDate', pickupDate.value);
	}
	namefield.addEventListener('change', saveFormToSession);
	emailfield.addEventListener('change', saveFormToSession);
	requestTypeRadios.forEach((radioButton) => {
		radioButton.addEventListener('click', saveFormToSession);
	});
	requestDetails.addEventListener('change', saveFormToSession);
	allergyNotes.addEventListener('change', saveFormToSession);
	pickupDate.addEventListener('change', saveFormToSession);

	// Contact Form Validations
	namefield.addEventListener('blur', (event) => {
		validateRequiredFields(event.target)
	});
	emailfield.addEventListener('blur', (event) => {
		validateRequiredFields(event.target)
	});
	requestDetails.addEventListener('blur', (event) => {
		validateRequiredFields(event.target)
	});

	function validateRequiredFields(element) {
		const namePattern = /[A-Za-z.\-]+/;
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const detailsPattern = /\S/;

		if (element.name == 'name') {
			nameValid = namePattern.test(namefield.value);
			document.getElementById('name-error').classList.toggle('hidden', nameValid);
		}
		if (element.name == 'email_address') {
			emailValid = emailPattern.test(emailfield.value);
			document.getElementById('email-error').classList.toggle('hidden', emailValid);
		}
		if (element.name == 'request_details') {
			detailsValid = detailsPattern.test(requestDetails.value);
			document.getElementById('details-error').classList.toggle('hidden', detailsValid);
		}
		isValid = nameValid && emailValid && detailsValid;
	}

	function submitForm(event) {
		event.preventDefault();
		if (isValid) {
			console.log('Validation passed, submitting form');
			sessionStorage.removeItem('namefield');
			sessionStorage.removeItem('emailfield');
			sessionStorage.removeItem('requestType');
			sessionStorage.removeItem('requestDetails');
			sessionStorage.removeItem('allergyNotes');
			sessionStorage.removeItem('pickupDate');
			window.location.href = 'thankyou.html';
			//event.target.submit();
		} else {
			console.log('Validation failed, showing errors');
		}
	}
	contactForm.addEventListener('submit', submitForm);

	// Display Contact Form Preorder Fields Based on Request Type Selection
	function toggleRequestFields(selectedRadio) {
		if (selectedRadio.checked == true && selectedRadio.value == 'preorder') {
			requestDetailsLabel.innerText = 'Order Details:';
			preorderRequestFields.classList.remove('hidden');
		} else {
			requestDetailsLabel.innerText = 'Question Details:';
			preorderRequestFields.classList.add('hidden');
		}
	}
	requestTypeRadios.forEach((radioButton) => {
		radioButton.addEventListener('click', (event) => {
			toggleRequestFields(event.target)
		});
	});
}
