let fishCaughtToday = 0;
    let ecoHealth = 100;
    let money = 0;
    let dailyMoney = 0;
    let day = 1;
    let currentSeasonIndex = 0;
    let ecoHealthRecoveryRate = 1;
    const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];
    const header = document.getElementById('header');
    const fishCaughtTodayEl = document.getElementById('fishCaughtToday');
    const ecoHealthEl = document.getElementById('ecoHealth');
    const moneyEl = document.getElementById('money');
    const seasonEl = document.getElementById('season');
    const seasonBadge = document.getElementById('seasonBadge');
    const map = document.getElementById('fishingMap');
    

    const upgrades = {
      fishingRod: {
        level: 1,
        baseCost: 50,
        cost: 50,
        effect: function () {
          fishValue += 2; // Increase fish value
        },
      },
      ecoBoat: {
        level: 0,
        baseCost: 100,
        cost: 100,
        effect: function () {
          ecoHealthRecoveryRate += 4; // Increase eco health recovery rate
        },
      },
    };

    const events = [
    { type: "positive", message: "Treasure discovered! Bonus money added!", effect: () => addBonusPoints(100) },
    { type: "positive", message: "Perfect weather! Ecosystem recovery rate increased!", effect: () => increaseRecoveryRate() },
    { type: "negative", message: "Storm approaching! Fish value reduced.", effect: () => decreaseFishValue() },
    { type: "negative", message: "Pollution incident! Reduce ecosystem health.", effect: () => decreaseSustainability(10) },
];

// Fish population array
const fish = [
  { type: "Salmon", zone: "north", value: 10 },
  { type: "Tuna", zone: "south", value: 15 },
  { type: "Clownfish", zone: "west", value: 5 },
  { type: "Shark", zone: "east", value: 50 },
];

// Challenge Variables
let challengeActive = false;
let challengeType = "";
let challengeTimer = 0;
let challengeGoal = 0;
let challengeReward = 100; // Reward amount
let challengeGoalInitial;


function startChallenge(type) {
  if (challengeActive) {
    alert("A challenge is already active!");
    return;
  }

  challengeActive = true;
  challengeType = type;
  document.getElementById("challengeDisplay").style.display = "block";

  if (type === "eco-friendly") {
    challengeTimer = 30; // 30 seconds
    challengeGoal = 20; // Catch 20 fish
    challengeReward = 200; // Reward
    challengeGoalInitial = challengeGoal; // Set initial goal for progress tracking
    document.getElementById("challengeTitle").textContent =
      "Challenge: Catch 20 fish while keeping eco-health above 80%!";
  } else if (type === "random-zone") {
    challengeTimer = 25; // 25 seconds
    challengeGoal = 150; // Earn $150 in 25 seconds
    challengeReward = 150; // Reward
    challengeGoalInitial = challengeGoal;
    document.getElementById("challengeTitle").textContent = `Challenge: Earn $150 in under 25 seconds!`;
  }

  updateChallengeUI();
  startChallengeTimer();
}

function updateChallengeUI() {
  const progressBar = document.getElementById("challengeProgressBar");
  const progress = ((challengeGoalInitial - challengeGoal) / challengeGoalInitial) * 100;
  progressBar.style.width = `${progress}%`;

  const timerEl = document.getElementById("challengeTimer");
  timerEl.textContent = `Time Left: ${challengeTimer}s`;
}

function startChallengeTimer() {
  const interval = setInterval(() => {
    if (!challengeActive) {
      clearInterval(interval);
      return;
    }

    challengeTimer--;
    updateChallengeUI();

    if (challengeTimer <= 0) {
      endChallenge(false);
      clearInterval(interval);
    }
  }, 1000);
}




function handleChallengeFishCatch(fish) {
  if (!challengeActive) return;

  if (challengeType === "eco-friendly") {
    if (ecoHealth >= 80) {
      challengeGoal--;
      if (challengeGoal <= 0) {
        endChallenge(true);
      }
    }
  } else if (challengeType === "random-zone") {
    document.getElementById('endDayButton').addEventListener('click', function () {
      challengeGoal -= fish.value;
      if (challengeGoal <= 0 && challengeActive) {
        endChallenge(true);
      
      }
    });
    }
  

  updateChallengeUI();
}


function endChallenge(success) {
  if (success) {
    alert(`Challenge completed! You earned $${challengeReward}.`);
    money += challengeReward;
    moneyEl.textContent = money.toFixed(2);
  } else {
    alert("Challenge failed! Better luck next time.");
  }

  challengeActive = false;
  document.getElementById("challengeDisplay").style.display = "none";
}


function triggerRandomChallenge() {
  const random = Math.random();
  if (random < 0.5) {
    startChallenge("eco-friendly");
  } else {
    startChallenge("random-zone");
  }
}

// Trigger every 5 days
setInterval(() => {
  if (day % 5 === 0 && !challengeActive) {
    triggerRandomChallenge();
  }
}, 1000);





function triggerRandomEvent() {
    // Pick a random event
    const randomIndex = Math.floor(Math.random() * events.length);
    const event = events[randomIndex];

    // Display the event notification
    const notification = document.getElementById("event-notification");
    notification.textContent = event.message;
    notification.style.display = "block";

    // Apply the event effect
    event.effect();

    // Hide the notification after 5 seconds
    setTimeout(() => {
        notification.style.display = "none";
    }, 5000);
}

// Call this function every 20–30 seconds
setInterval(triggerRandomEvent, Math.random() * (30000 - 20000) + 20000);

// Example functions for event effects
function addBonusPoints(points) {
    console.log(`Added ${points} bonus money!`);
    money += points;
    moneyEl.textContent = money.toFixed(2);
}

function increaseRecoveryRate() {
    console.log("Ecosystem recovery rate increased!");
    ecoHealthRecoveryRate += 2; // Increase eco health recovery rate
}

function decreaseFishValue() {
    console.log("Fish value decreased!");
    fishValue -= 2; // Decrease fish value

    // Restore normal earnings after some time
    setTimeout(() => {
        fishValue += 2;
        notification.textContent = "Equipment repaired. Fish value back to normal.";
        notification.style.display = "block";
        setTimeout(() => {
            notification.style.display = "none";
        }, 5000);
    }, 30000); // 30 seconds

}

function decreaseSustainability(points) {
    console.log(`Ecosystem health reduced by ${points}`);
    ecoHealth -= points;
    document.getElementById('ecoHealth').textContent = `${Math.floor(ecoHealth)}%`;
}


    // Create 25 fishing zones (5x5 grid)
    function createFishingZones() {
      for (let i = 0; i < 25; i++) {
        const zone = document.createElement('div');
        zone.classList.add('zone');
        zone.dataset.zone = "north";
        zone.style.border = '1px solid #00796b';
        zone.dataset.fish = 10; // Each zone starts with 10 fish
        zone.textContent = zone.dataset.fish;

        zone.addEventListener('click', () => {
            let fishInZone = parseInt(zone.dataset.fish, 10);
          
            if (fishInZone > 0) {
              // Find the fish associated with this zone
              const fishInThisZone = fish.find(f => f.zone === zone.dataset.zone);

              if (ecoHealth > 100) {
                handleChallengeFishCatch(fishInThisZone); // Pass the correct fish object
                fishInZone--;
                fishCaughtToday++;
                ecoHealth -= 5; // Decrease ecosystem health
                zone.dataset.fish = fishInZone;
                zone.textContent = fishInZone;
          
                fishCaughtTodayEl.textContent = fishCaughtToday;
                ecoHealthEl.textContent = `${ecoHealth}%`;
          
            } else {
                handleChallengeFishCatch(fishInThisZone);
                fishInZone--;
                fishCaughtToday++;
                ecoHealth -= 1; // Decrease ecosystem health
                zone.dataset.fish = fishInZone;
                zone.textContent = fishInZone;
          
                fishCaughtTodayEl.textContent = fishCaughtToday;
                ecoHealthEl.textContent = `${ecoHealth}%`;
            }
              
            if (ecoHealth <= 0) {
                alert('Game Over! The ecosystem is destroyed!');
              }
            } else {
              alert('This zone has no fish left!');
            }
          }
          );
          

        map.appendChild(zone);
      }
    }

    createFishingZones();

    // Update header based on Ecosystem Health
    function updateHeader() {
      if (ecoHealth > 50) {
        header.style.background = '#00796b';
        header.textContent = `Day ${day}: Ecosystem is Healthy`;
      } else if (ecoHealth > 50) {
        header.style.background = '#ffa726';
        header.textContent = `Day ${day}: Warning! Ecosystem at Risk`;
      } else {
        header.style.background = '#e53935';
        header.textContent = `Day ${day}: Critical! Ecosystem in Danger`;
      }
    }

    updateHeader();

    // Replenish Fish Function
    function replenishFish() {
  const zones = document.querySelectorAll('.zone');
  zones.forEach((zone) => {
    let fishInZone = parseInt(zone.dataset.fish, 10);

    // Fish replenish slower if ecoHealth is below 50%
    const replenishRate = ecoHealth > 50 ? 1 : 0.5;

    if (fishInZone < 10) { 
      fishInZone += replenishRate; 
      fishInZone = Math.min(10, fishInZone); // Cap fish at 10
      zone.dataset.fish = fishInZone;
      zone.textContent = Math.floor(fishInZone);
    }
  });

  // Recover ecoHealth only if it's not destroyed
  if (ecoHealth < 100 && ecoHealth > 0) {
    ecoHealth += ecoHealthRecoveryRate; 
    document.getElementById('ecoHealth').textContent = `${Math.floor(ecoHealth)}%`;
  }
}


    // Change Seasons every 10 days
    function changeSeason() {
      if (day % 10 === 0) {
        currentSeasonIndex = (currentSeasonIndex + 1) % seasons.length;
        const currentSeason = seasons[currentSeasonIndex];
        updateSeasonEffect(currentSeason);
        seasonEl.textContent = `Current Season: ${currentSeason}`;  // Update season text
      }
    }

    function updateSeasonEffect(season) {
      if (season === 'Winter') {
        ecoHealthRecoveryRate -= 3; // Decrease eco health in winter
        seasonBadge.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/2530/2530064.png')";
        seasonBadge.style.backgroundColor = "#b3e5fc"; // Light blue for winter
      } else if (season === 'Spring') {
        ecoHealthRecoveryRate += 4; // Increase eco health in spring
        seasonBadge.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/346/346218.png')";
        seasonBadge.style.backgroundColor = "#c8e6c9"; // Soft green for spring
      } else if (season === 'Summer') {
        seasonBadge.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/10480/10480648.png')";
        seasonBadge.style.backgroundColor = "#ffe082"; // Yellow for summer
      } else if (season === 'Fall') {
        seasonBadge.style.backgroundColor = "#ffcc80"; // Orange for fall
        seasonBadge.style.backgroundImage = "url('https://png.pngtree.com/png-vector/20220607/ourmid/pngtree-autumn-falling-leaves-icon-isolated-on-white-background-png-image_4853420.png')";
      }
      seasonEl.textContent = `Current Season: ${season}`;
    }

    // Define the initial fish value based on the fishing rod level
    let fishValue = upgrades.fishingRod.level * 5;

    // Upgrade Fishing Rod
    document.getElementById('buyFishingRod').addEventListener('click', function () {
      const upgrade = upgrades.fishingRod;
      if (money >= upgrade.cost) {
        money -= upgrade.cost;
        upgrade.level++;
        fishValue = upgrade.level * 5; // Update fish value
        upgrade.cost = upgrade.baseCost + upgrade.level * 25; // Increase upgrade cost
        moneyEl.textContent = money.toFixed(2);
        document.getElementById('fishingRodLevel').textContent = `Level: ${upgrade.level}`;
        // Update the price displayed on the button
        document.getElementById('buyFishingRod').textContent = `Upgrade Fishing Rod - $${upgrade.cost}`;
      } else {
        alert('Not enough money!');
      }
    });

    // Upgrade Eco Boat
    document.getElementById('buyEcoBoat').addEventListener('click', function () {
      const upgrade = upgrades.ecoBoat;
      if (money >= upgrade.cost) {
        money -= upgrade.cost;
        upgrade.level++;
        upgrade.effect();
        upgrade.cost = upgrade.baseCost + upgrade.level * 50;
        ecoHealthRecoveryRate += 4; // Increase eco health recovery rate
        moneyEl.textContent = money.toFixed(2);
        document.getElementById('ecoBoatLevel').textContent = `Level: ${upgrade.level}`;
        // Update the price displayed on the button
        document.getElementById('buyEcoBoat').textContent = `Upgrade Eco Boat - $${upgrade.cost}`;
      } else {
        alert('Not enough money!');
      }
    });

    // End Day Button
    document.getElementById('endDayButton').addEventListener('click', function () {
      day += 1;
      updateHeader();
      changeSeason();
      money += fishCaughtToday * fishValue; // Sell fish caught during the day
      fishCaughtToday = 0; // Reset daily fish count
      fishCaughtTodayEl.textContent = fishCaughtToday;
      moneyEl.textContent = money.toFixed(2);
      replenishFish(); // Replenish fish in all zones
    });


    updateSeasonEffect(seasons[currentSeasonIndex]);
