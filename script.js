'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Shivam Singh',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Anup Deshmukh',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Dipan Singh',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sara Ali Khan',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// // const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

////////////////////////// code //////////////////////////////////

// generating username 
const username = function(accounts){
  accounts.forEach(function(acc){
    acc.username = acc.owner.toLowerCase().split(' ').map( name => name[0]).join('');
  });
};
username(accounts);



// displaying deposit and withdraw movement
const displayMovement = function (movements,sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
    movs.forEach(function(mov,i) {
      
      const type = (mov > 0) ? 'deposit' : 'withdrawal';
      const html = `
      <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
            <div class="movements__date">3 days ago</div>
            <div class="movements__value">${mov} rs</div>
      </div> `;
      containerMovements.insertAdjacentHTML('afterbegin',html);
      

    });
};

//  display current balance
const currentBalance = function(account){
  const currBal = account.movements.reduce( (acc,mov) => acc + mov,0);
  labelBalance.textContent = currBal + " rs";
  account.totalBal = currBal;
}


//  summary functionalities
const summary = function(ownAccount){
    const inValue = ownAccount.movements.filter( mov => mov > 0).reduce((acc,red) => acc+red,0);
    labelSumIn.textContent = inValue + "rs";

    const outValue = ownAccount.movements.filter(mov => mov<0).reduce( (acc,red) => acc+red,0 );
    labelSumOut.textContent = Math.abs(outValue) +"rs";

    const intersetValue = ownAccount.movements.filter(mov => mov > 0).map( mov => mov*(ownAccount.interestRate)/100).filter(mov =>  mov >= 1).reduce((acc,total) => acc + total);
    labelSumInterest.textContent = intersetValue +"rs";    
    console.log(ownAccount.interestRate)
};

// timer function
const countTimer = function(){
    const tick = function(){
      let min = String(Math.trunc( time/60)).padStart(2,0);
      let sec = String(Math.trunc( time%60)).padStart(2,0);
      labelTimer.textContent = `${min}:${sec}`;
      
      if(time === 0){
          clearInterval(timer);
          containerApp.style.opacity = 0;
          labelWelcome.textContent = 'Log in to get started';
          // console.log(intervalVar);
      }
      time --;
    };

      let time = 10;
      tick();
      const timer = setInterval(tick,1000);
    
    // console.log(intervalVar)
  return timer;
};

// UPDATE UI FUNCTION
const updateUI = function(account){

         // displaying movements
      displayMovement(account.movements);

      // displaying current balance
      currentBalance(account);

      // displaying summary
      summary(account);
}

// implementing login and handle events.
let currentUser, timer ;

currentUser = account1;
containerApp.style.opacity = 100;
updateUI(currentUser);

btnLogin.addEventListener('click',function(e){
  e.preventDefault();

    currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);

    if(currentUser?.pin === Number(inputLoginPin.value)){
      inputLoginPin.blur();
      containerApp.style.opacity = 100;
      labelWelcome.textContent = `WARM TO -${currentUser.owner}`;

      // making input field blank after login
      inputLoginUsername.value = inputLoginPin.value = '';

      
      // timer
      if(timer) clearInterval(timer);
      timer = countTimer();


    //   displaying ui
    updateUI(currentUser);
    };
});


// transfer money
btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
    const transferAcc = accounts.find(acc => acc.username === inputTransferTo.value);
    const transferAmount =Number(inputTransferAmount.value);

    inputTransferTo.value = inputTransferAmount.value = '';

    if(currentUser.totalBal >= transferAmount && transferAcc && transferAmount > 0 && transferAcc?.username !== currentUser.username){
          currentUser.movements.push(-transferAmount);
          transferAcc.movements.push(transferAmount);

          updateUI(currentUser);
          console.log(currentUser);
    };
});

// close account  event handler

btnClose.addEventListener('click',function(e){
  e.preventDefault();
    
    if(currentUser.username === inputCloseUsername.value && currentUser.pin === Number(inputClosePin.value)){

      const userIndex = accounts.findIndex(acc => acc.username === currentUser.username);
      
      accounts.splice(userIndex , 1);
      containerApp.style.opacity = 0;

    }
});

// request loan event handle

btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const loan = Number(inputLoanAmount.value);
  if(loan > 0 && loan <= currentUser.totalBal*0.5){
    currentUser.movements.push(loan);

    // update UI
    updateUI(currentUser);
  }
});

// sorting event handle
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentUser.movements, !sorted);
  sorted = !sorted;
});