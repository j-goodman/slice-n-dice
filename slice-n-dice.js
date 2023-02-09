const prompts = require('prompts');

console.log("SLICE-N-DICE");

const rollDie = () => {
    return Math.ceil(Math.random() * 6)
}

const rollDice = (number, advantage) => {
    let rolls = [];
    for (let i = 0; i < number; i++) {
        rolls.push(rollDie())
    }
    rolls.sort()
    if (advantage) {
        return rolls[number - 1] + rolls[number - 2];
    } else {
        return rolls[0] + rolls[1];
    }
}

(async () => {
  const numberOfRolls = await prompts({
    type: 'number',
    name: 'value',
    message: 'How many rolls are being made?',
  });
  
  const numberOfDice = await prompts({
    type: 'number',
    name: 'value',
    message: 'How many dice per roll?',
  });

  const advantageInput = await prompts({
    type: 'text',
    name: 'value',
    message: 'With advantage, or disadvantage? (a/d)',
    validate: value => !["a", "d"].includes(value) ? `Please input a or d` : true
  });
  
  const skillBonus = await prompts({
    type: 'number',
    name: 'value',
    message: "What's the skill bonus?",
  });
  
  const hitNumber = await prompts({
    type: 'number',
    name: 'value',
    message: 'How high do they need to roll for a hit?',
  });

  let hits = 0;
  let misses = 0;

  let rollTimer = []
  let diceDelay = 80

  if (numberOfRolls.value > 30000) {
    diceDelay = 0
  } else if (numberOfRolls.value > 1000) {
    diceDelay = 1
  } else if (numberOfRolls.value > 500) {
    diceDelay = 10
  } else if (numberOfRolls.value > 100) {
    diceDelay = 20
  } else if (numberOfRolls.value > 20) {
    diceDelay = 40
  }
  
  for (let i = 0; i < numberOfRolls.value; i++) {
    const roll = rollDice(numberOfDice.value, advantageInput.value === "a") + skillBonus.value
    const hit = roll >= hitNumber.value
    rollTimer.push({icon: hit ? "❎" : "⬛", time: diceDelay * i})
    if (roll >= hitNumber.value) {
        hits += 1;
    } else {
        misses += 1;
    }
  }
  rollTimer.forEach(
    obj => {
        setTimeout(() => {
            process.stdout.write(obj.icon);
        }, obj.time)
    }
  )
  setTimeout(() => {
    console.log(`\n${hits} hit${hits === 1 ? "" : "s"}!`);
  }, numberOfRolls.value * diceDelay + diceDelay);
  setTimeout(() => {
    console.log(`${misses} miss${misses === 1 ? "" : "es"}.`);
  }, numberOfRolls.value * diceDelay + diceDelay * 2);
})();