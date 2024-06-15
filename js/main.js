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
const planItems = document.querySelectorAll('.plan-item');
const usageText = document.querySelector('.usage-text');
const grindMainResults = document.querySelectorAll('.grind-main-result');


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

window.addEventListener('load', setItemWidth);
window.addEventListener('resize', setItemWidth);



// Order Button Functionality
if (orderButton && orderWrapper && overlay && summaryWrapper) {
   let isCapsuleSelected = false;

   updateOrderBtnState();
   updatePlanNavClasses();

   orderButton.addEventListener('click', function () {
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

         let cost = 0;
         if (deliverResult.textContent === 'Every week') {
               cost = Number(weekPrice.textContent) * 4;
         } else if (deliverResult.textContent === 'Every 2 weeks') {
               cost = Number(twoWeekPrice.textContent) * 2;
         } else if (deliverResult.textContent === 'Every month') {
               cost = Number(monthPrice.textContent);
         }

         totalCosts.forEach(totalCost => {
               totalCost.textContent = cost.toFixed(2); 
         });
      }
   });

// Iterate over each plan item and add click event listeners to option items within each plan
planItems.forEach(plan => {
   const optionItems = plan.querySelectorAll('.option-item');

   // Add event listener to each option item
   optionItems.forEach(item => {
       item.addEventListener('click', function () {
           // Remove 'option-item-active' class from all option items within the current plan
           optionItems.forEach(item => {
               item.classList.remove('option-item-active');
           });

           // Add 'option-item-active' class to the clicked option item
           this.classList.add('option-item-active');

           // Update various result sections based on the type of plan (coffee, type, quality, grind, deliver)
           const coffeeResults = document.querySelectorAll('.coffee-result');
           const typeResults = document.querySelectorAll('.type-result');
           const qualityResults = document.querySelectorAll('.quality-result');
           const grindResults = document.querySelectorAll('.grind-result');
           const deliverResults = document.querySelectorAll('.deliver-result');

           if (plan.classList.contains('coffee-option')) {
               // Update coffee results section
               coffeeResults.forEach(result => {
                   result.textContent = this.querySelector('h5').textContent;
                   result.classList.remove('border-bottom');
               });

               // Determine if capsule is selected and adjust UI accordingly
               isCapsuleSelected = this.querySelector('h5').textContent === 'Capsule';
               toggleGrindOption(isCapsuleSelected);

               // Update usage text based on selection
               if (isCapsuleSelected) {
                   usageText.textContent = 'using';
               } else {
                   usageText.textContent = 'as';
               }
           } else if (plan.classList.contains('type-option')) {
               // Update type results section
               typeResults.forEach(result => {
                   result.textContent = this.querySelector('h5').textContent;
                   result.classList.remove('border-bottom');
               });
           } else if (plan.classList.contains('quality-option')) {
               // Update quality results section and update price per shipment
               qualityResults.forEach(result => {
                   result.textContent = this.querySelector('h5').textContent;
                   result.classList.remove('border-bottom');
               });
               updatePricePerShipment();
           } else if (plan.classList.contains('grind-option')) {
               // Update grind results section
               grindResults.forEach(result => {
                   result.textContent = this.querySelector('h5').textContent;
                   result.classList.remove('border-bottom');
               });
           } else if (plan.classList.contains('deliver-option')) {
               // Update deliver results section
               deliverResults.forEach(result => {
                   result.textContent = this.querySelector('h5').textContent;
                   result.classList.remove('border-bottom');
               });
           }

           // Update order button state based on selected options
           updateOrderBtnState();
       });
   });
});


// Activate the first option wrapper and arrow for initial display
const firstOptionWrapper = document.querySelector('.option-wrapper');
firstOptionWrapper.classList.add('option-wrapper-active');

const firstArrow = firstOptionWrapper.closest('.plan-item').querySelector('.arrow');
firstArrow.classList.add('arrow-active');

// Add click event listeners to all option items
const optionItems = document.querySelectorAll('.option-item');
optionItems.forEach(function (optionItem) {
    optionItem.addEventListener('click', function () {
        // Determine the current option and plan item
        const currentOptionWrapper = optionItem.closest('.option-wrapper');
        const currentPlanItem = currentOptionWrapper.closest('.plan-item');

        // Determine the next plan item to activate if conditions are met
        let nextPlanItem = currentPlanItem.nextElementSibling;
        if (isCapsuleSelected && currentPlanItem.classList.contains('quality-option')) {
            nextPlanItem = nextPlanItem.nextElementSibling;
        }

        // Activate the next option wrapper and arrow if it exists
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

        // Update price per shipment and plan navigation classes
        updatePricePerShipment();
        updatePlanNavClasses();
    });
});


document.addEventListener('click', function (event) {
   if (!orderWrapper.contains(event.target) && !orderButton.contains(event.target)) {
      orderWrapper.classList.remove('order-wrapper');
      overlay.classList.remove('overlay-visible');
   }
});

const checkoutBtn = document.querySelector('#checkout-btn');

checkoutBtn.addEventListener('click', function () {
   orderWrapper.classList.remove('order-wrapper');
   overlay.classList.remove('overlay-visible');
});


   // Functions
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
  
  function getPrices(activeText) {
      const priceMap = {
          '250': { week: '7.20', twoWeek: '9.60', month: '12.00' },
          '500': { week: '13.00', twoWeek: '17.50', month: '22.00' },
          '1000': { week: '22.00', twoWeek: '32.00', month: '42.00' },
      };
      return priceMap[activeText] || { week: '0.00', twoWeek: '0.00', month: '0.00' };
  }

   function updateOrderBtnState() {
      const allActive = Array.from(optionWrappers).every(wrapper => {
         if (isCapsuleSelected && wrapper.closest('.plan-item').classList.contains('grind-option')) {
               return true;
         }
         return wrapper.classList.contains('option-wrapper-active') && wrapper.querySelector('.option-item.option-item-active');
      });

      orderButton.classList.toggle('not-active-btn', !allActive);
   }

    function updatePlanNavClasses() {
      const planNavItems = document.querySelectorAll('.plan-nav-item');
      planNavItems.forEach((navItem, index) => {
         const planItem = document.querySelector(`.plan-item:nth-child(${index + 1}) .option-wrapper`);
         const isActive = planItem.classList.contains('option-wrapper-active');
         const isSelected = planItem.querySelector('.option-item.option-item-active');

         const numElement = navItem.querySelector('.plan-num');
         const textElement = navItem.querySelector('.plan-text');

         numElement.classList.remove('plan-active-num', 'plan-selected-num');
         textElement.classList.remove('plan-active-text', 'plan-selected-text');

         if (isSelected) {
               numElement.classList.add('plan-selected-num');
               textElement.classList.add('plan-selected-text');
         } else if (isActive) {
               numElement.classList.add('plan-active-num');
               textElement.classList.add('plan-active-text');
         }
      });
   }

   // const grindMainResults = document.querySelectorAll('.grind-main-result');

   function toggleGrindOption(isCapsuleSelected) {
      const grindOption = document.querySelector('.plan-item.grind-option');
      const grindOptionWrapper = grindOption.querySelector('.option-wrapper');
      const grindOptionArrow = grindOption.querySelector('.arrow');
      const grindQuestion = grindOption.querySelector('.question-wrapper h3');
      const grindNumItem = document.querySelector('.grind-item .plan-num');
      const grindTextItem = document.querySelector('.grind-item .plan-text');

      if (isCapsuleSelected) {
         grindOptionWrapper.classList.remove('option-wrapper-active');
         grindOptionArrow.classList.remove('arrow-active');
         grindMainResults.forEach(result => {
               result.classList.add('hidden');
         });

         grindNumItem.classList.add('disabled');
         grindTextItem.classList.add('disabled');
         grindQuestion.classList.add('disabled');
      } else {
         const previousItemsActive = Array.from(grindOption.previousElementSibling.querySelectorAll('.option-wrapper')).every(wrapper => wrapper.classList.contains('option-wrapper-active'));

         if (previousItemsActive) {
               grindOptionWrapper.classList.add('option-wrapper-active');
               grindOptionArrow.classList.add('arrow-active');
               grindMainResults.forEach(result => {
                  result.classList.remove('hidden');
               });
               grindNumItem.classList.remove('disabled');
               grindTextItem.classList.remove('disabled');
               grindQuestion.classList.remove('disabled');
         }
      }

      updatePlanNavClasses();
   }
}

