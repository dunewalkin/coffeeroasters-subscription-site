// Element Selectors
const primaryNav = document.querySelector(".primary-navigation");
const navToggle = document.querySelector(".mobile-nav-toggle");
const headerWrapper = document.querySelector(".header-wrapper");
const howItWorksItems = document.querySelectorAll('.how-it-works-item');
const orderButton = document.querySelector('#order-btn');
const orderWrapper = document.querySelector('.order-wrapper-hidden');
const overlay = document.querySelector('.overlay');
const summaryWrapper = document.querySelector('.summary-wrapper');
const optionWrappers = document.querySelectorAll('.option-wrapper');
const heroBtn = summaryWrapper ? summaryWrapper.querySelector('.hero-btn') : null;
const weekPrice = document.querySelector('.week-price');
const twoWeekPrice = document.querySelector('.two-week-price');
const monthPrice = document.querySelector('.month-price');

// Global variable for capsule selection
let isCapsuleSelected = false;

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    toggleVisibility(headerWrapper);
    toggleVisibility(primaryNav);
    toggleAriaExpanded(navToggle);
});

function toggleVisibility(element) {
    const visibility = element.getAttribute("data-visible") === "false" ? "true" : "false";
    element.setAttribute("data-visible", visibility);
}

function toggleAriaExpanded(element) {
    const expanded = element.getAttribute("aria-expanded") === "false" ? "true" : "false";
    element.setAttribute("aria-expanded", expanded);
}

// Set Width of How It Works Items
function setItemWidth() {
    howItWorksItems.forEach(item => {
        const itemWidth = item.offsetWidth;
        document.documentElement.style.setProperty('--item-width', `${itemWidth}px`);
    });
}

window.addEventListener('load', () => {
    setItemWidth();
    initializeFirstQuestion();
});
window.addEventListener('resize', setItemWidth);

// Initialize the first question to be open
function initializeFirstQuestion() {
    const firstOptionWrapper = document.querySelector('.coffee-option .option-wrapper');
    if (firstOptionWrapper) {
        firstOptionWrapper.classList.add('option-wrapper-active');
        const firstArrow = firstOptionWrapper.closest('.plan-item').querySelector('.arrow');
        if (firstArrow) {
            firstArrow.classList.add('arrow-active');
        }
    }
    updateOrderBtnState();
    updatePlanNavClasses();
}

// Order Button Functionality
if (orderButton && orderWrapper && overlay && summaryWrapper) {

    updateOrderBtnState();
    updatePlanNavClasses();

    orderButton.addEventListener('click', handleOrderButtonClick);
    document.addEventListener('click', handleDocumentClick);
    const checkoutBtn = document.querySelector('#checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckoutButtonClick);
    }

    const optionItems = document.querySelectorAll('.option-item');
    optionItems.forEach(item => item.addEventListener('click', () => handleOptionItemClick(item)));
}

// Handle Order Button Click
function handleOrderButtonClick() {
    const deliverResult = document.querySelector('.deliver-result');
    const totalCosts = document.querySelectorAll('.total-cost');

    const allActive = Array.from(optionWrappers).every(wrapper => {
        if (isCapsuleSelected && wrapper.closest('.plan-item').classList.contains('grind-option')) {
            return true;
        }
        return wrapper.classList.contains('option-wrapper-active') && wrapper.querySelector('.option-item.option-item-active');
    });

    if (allActive) {
        orderWrapper.classList.add('order-wrapper');
        overlay.classList.add('overlay-visible');

        let cost = calculateTotalCost(deliverResult.textContent);
        totalCosts.forEach(totalCost => totalCost.textContent = cost.toFixed(2));
    }
}

// Calculate Total Cost Based on Delivery Frequency
function calculateTotalCost(deliveryFrequency) {
    const priceMap = {
        'Every week': Number(weekPrice.textContent) * 4,
        'Every 2 weeks': Number(twoWeekPrice.textContent) * 2,
        'Every month': Number(monthPrice.textContent),
    };
    return priceMap[deliveryFrequency] || 0;
}

// Handle Document Click
function handleDocumentClick(event) {
    if (!orderWrapper.contains(event.target) && !orderButton.contains(event.target)) {
        orderWrapper.classList.remove('order-wrapper');
        overlay.classList.remove('overlay-visible');
    }
}

// Handle Checkout Button Click
function handleCheckoutButtonClick() {
    orderWrapper.classList.remove('order-wrapper');
    overlay.classList.remove('overlay-visible');
}

// Handle Option Item Click
function handleOptionItemClick(optionItem) {
    const currentOptionWrapper = optionItem.closest('.option-wrapper');
    const currentPlanItem = currentOptionWrapper.closest('.plan-item');

    let nextPlanItem = currentPlanItem.nextElementSibling;
    if (isCapsuleSelected && currentPlanItem.classList.contains('quality-option')) {
        nextPlanItem = nextPlanItem.nextElementSibling;
    }

    // Activate next question
    currentOptionWrapper.classList.add('option-wrapper-active');
    currentOptionWrapper.querySelectorAll('.option-item').forEach(item => item.classList.remove('option-item-active'));
    optionItem.classList.add('option-item-active');

    if (nextPlanItem) {
        const nextOptionWrapper = nextPlanItem.querySelector('.option-wrapper');
        if (nextOptionWrapper) {
            nextOptionWrapper.classList.add('option-wrapper-active');
            const nextArrow = nextPlanItem.querySelector('.arrow');
            if (nextArrow) {
                nextArrow.classList.add('arrow-active');
            }
        }
    }

    const coffeeResults = document.querySelectorAll('.coffee-result');
    const typeResults = document.querySelectorAll('.type-result');
    const qualityResults = document.querySelectorAll('.quality-result');
    const grindResults = document.querySelectorAll('.grind-result');
    const deliverResults = document.querySelectorAll('.deliver-result');
    const usageText = document.querySelector('.usage-text');

    if (currentPlanItem.classList.contains('coffee-option')) {
        updateResults(coffeeResults, optionItem);
        isCapsuleSelected = optionItem.querySelector('h5').textContent === 'Capsule';
        toggleGrindOption(isCapsuleSelected);
        usageText.textContent = isCapsuleSelected ? 'using' : 'as';
    } else if (currentPlanItem.classList.contains('type-option')) {
        updateResults(typeResults, optionItem);
    } else if (currentPlanItem.classList.contains('quality-option')) {
        updateResults(qualityResults, optionItem);
        updatePricePerShipment();
    } else if (currentPlanItem.classList.contains('grind-option')) {
        updateResults(grindResults, optionItem);
    } else if (currentPlanItem.classList.contains('deliver-option')) {
        updateResults(deliverResults, optionItem);
    }

    updateOrderBtnState();
    updatePricePerShipment();
    updatePlanNavClasses();
}

// Update Results
function updateResults(results, item) {
    results.forEach(result => {
        result.textContent = item.querySelector('h5').textContent;
        result.classList.remove('border-bottom');
    });
}

// Toggle Grind Option
function toggleGrindOption(isCapsuleSelected) {
   const grindOption = document.querySelector('.plan-item.grind-option');
   const grindOptionWrapper = grindOption.querySelector('.option-wrapper');
   const grindOptionArrow = grindOption.querySelector('.arrow');
   const grindQuestion = grindOption.querySelector('.question-wrapper h3');
   const grindNumItem = document.querySelector('.grind-item .plan-num');
   const grindTextItem = document.querySelector('.grind-item .plan-text');
   const grindMainResults = document.querySelectorAll('.grind-main-result');

   if (isCapsuleSelected) {
       grindOptionWrapper.classList.remove('option-wrapper-active');
       grindOptionArrow.classList.remove('arrow-active');
       grindMainResults.forEach(result => result.classList.add('hidden'));
       grindNumItem.classList.add('disabled');
       grindTextItem.classList.add('disabled');
       grindQuestion.classList.add('disabled');
   } else {
       const previousItemsActive = Array.from(grindOption.previousElementSibling.querySelectorAll('.option-wrapper')).every(wrapper => {
           return wrapper.classList.contains('option-wrapper-active') && wrapper.querySelector('.option-item.option-item-active');
       });

       if (previousItemsActive) {
           grindOptionWrapper.classList.add('option-wrapper-active');
           grindOptionArrow.classList.add('arrow-active');
           grindMainResults.forEach(result => result.classList.remove('hidden'));
       }

       grindNumItem.classList.remove('disabled');
       grindTextItem.classList.remove('disabled');
       grindQuestion.classList.remove('disabled');
   }

   updatePlanNavClasses();
}

// Update Order Button State
function updateOrderBtnState() {
    const allActive = Array.from(optionWrappers).every(wrapper => {
        if (isCapsuleSelected && wrapper.closest('.plan-item').classList.contains('grind-option')) {
            return true;
        }
        return wrapper.classList.contains('option-wrapper-active') && wrapper.querySelector('.option-item.option-item-active');
    });

    orderButton.classList.toggle('not-active-btn', !allActive);
}

// Update Plan Navigation Classes
function updatePlanNavClasses() {
   console.log("Updating plan navigation classes");
   const planNavItems = document.querySelectorAll('.plan-nav-item');

   // Loop through each plan-nav-item
   planNavItems.forEach((navItem, index) => {
       let planItem = null;

       // Check if it's the grind-item
       if (isCapsuleSelected && index === 3) {
           planItem = document.querySelector('.grind-item .option-wrapper');
       } else {
           planItem = document.querySelector(`.plan-item:nth-child(${index + 1}) .option-wrapper`);
       }

       if (!planItem) {
           console.warn(`Plan item ${index + 1} not found`);
           return;
       }

       const isActive = planItem.classList.contains('option-wrapper-active');
       const isSelected = planItem.querySelector('.option-item.option-item-active');

       const numElement = navItem.querySelector('.plan-num');
       const textElement = navItem.querySelector('.plan-text');

       numElement.classList.remove('plan-active-num', 'plan-selected-num');
       textElement.classList.remove('plan-active-text', 'plan-selected-text');

       if (isSelected) {
           numElement.classList.add('plan-selected-num');
           textElement.classList.add('plan-selected-text');
           console.log(`Plan item ${index + 1} is selected`);
       } else if (isActive && !(isCapsuleSelected && index === 3)) {
           numElement.classList.add('plan-active-num');
           textElement.classList.add('plan-active-text');
           console.log(`Plan item ${index + 1} is active`);
       }
   });
}



// Update Price Per Shipment
function updatePricePerShipment() {
    const qualityOption = document.querySelector('.quality-option');
    const qualityOptionActive = qualityOption.querySelector('.option-item.option-item-active h5');
    if (qualityOptionActive) {
        const activeText = qualityOptionActive.textContent.slice(0, -1); // Remove the last character "g"
        const prices = getPrices(activeText);

        weekPrice.textContent = prices.week;
        twoWeekPrice.textContent = prices.twoWeek;
        monthPrice.textContent = prices.month;
    }
}

// Get Prices Based on Quantity
function getPrices(activeText) {
    const priceMap = {
        '250': { week: '7.20', twoWeek: '9.60', month: '12.00' },
        '500': { week: '13.00', twoWeek: '17.50', month: '22.00' },
        '1000': { week: '22.00', twoWeek: '32.00', month: '42.00' },
    };
    return priceMap[activeText] || { week: '0.00', twoWeek: '0.00', month: '0.00' };
}
