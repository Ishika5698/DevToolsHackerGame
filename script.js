let currentLevel = 1;
const totalLevels = 9;
let score = 0;
let startTime = Date.now();
let hackerAlias = localStorage.getItem("hackerAlias") || "Anonymous";

// Password for Level 4
const hiddenVariable = "jsninja";

// Password for Level 7
function debugThis() {
  const secret = "breakpoint";
  // Set a breakpoint here to find the password
}

// Leaderboard
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

const levels = {
  1: {
    description: "Level 1: Open the Console (DevTools) and find the password in a console.log message. Hint: Check console for a direct message.",
    answer: "hackme",
    setup: () => console.log("The password is: hackme")
  },
  2: {
    description: "Level 2: Check the HTML source (Elements tab) for a hidden comment with the password. Hint: Look at the bottom of the body.",
    answer: "secretcode",
    setup: () => {
      document.body.innerHTML += "<!-- The password is: secretcode -->";
    }
  },
  3: {
    description: "Level 3: Find the password in the CSS file (Sources tab, style.css, look for a comment). Hint: It's at the top of style.css.",
    answer: "finalkey",
    setup: () => {
      // Password is in style.css as a comment
    }
  },
  4: {
    description: "Level 4: Find the password stored in a JavaScript variable (Sources tab, script.js, search for hiddenVariable). Hint: Search for 'hiddenVariable' in script.js.",
    answer: "jsninja",
    setup: () => {
      // Password is in hiddenVariable above
    }
  },
  5: {
    description: "Level 5: Check the Network tab in DevTools. A fake API call logs the password to the console after a delay. Hint: Refresh and wait 1 second.",
    answer: "networkpro",
    setup: () => {
      setTimeout(() => {
        console.log("Fake API response: { password: 'networkpro' }");
      }, 1000);
    }
  },
  6: {
    description: "Level 6: In the Elements tab, find the 'data-password' attribute on the input element and change it to 'unlocked' to reveal the password in the console. Hint: Edit the input's attribute.",
    answer: "domhack",
    setup: () => {
      document.getElementById("answer-input").setAttribute("data-password", "locked");
      document.getElementById("answer-input").addEventListener("change", function() {
        if (this.getAttribute("data-password") === "unlocked") {
          console.log("DOM unlocked! Password: domhack");
        }
      });
    }
  },
  7: {
    description: "Level 7: Set a breakpoint in the Sources tab (script.js, debugThis function) to find the password stored in a variable. Hint: Pause execution in debugThis.",
    answer: "breakpoint",
    setup: () => {
      debugThis();
    }
  },
  8: {
    description: "Level 8: Check the Application tab > Cookies to find a cookie named 'hackerKey' with the password. Hint: Look under the current domain's cookies.",
    answer: "cookiepro",
    setup: () => {
      document.cookie = "hackerKey=cookiepro; path=/";
    }
  },
  9: {
    description: "Bonus Level: Use the Console to run 'revealSecret()' to find the password. Hint: Type revealSecret() in the Console.",
    answer: "elitehacker",
    setup: () => {
      window.revealSecret = function() {
        console.log("Secret password: elitehacker");
      };
      console.log("Bonus level unlocked! Run revealSecret() in the Console.");
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("hacker-alias").value = hackerAlias;
  updateUI();
  levels[currentLevel].setup();
  typeWriter(levels[currentLevel].description, "level-description");
  updateLeaderboard();
});

function saveAlias() {
  hackerAlias = document.getElementById("hacker-alias").value.trim() || "Anonymous";
  localStorage.setItem("hackerAlias", hackerAlias);
  updateLeaderboard();
}

function updateUI() {
  document.getElementById("level-number").textContent = currentLevel;
  document.getElementById("score").textContent = score;
  document.getElementById("progress-bar").style.width = `${(currentLevel / totalLevels) * 100}%`;
}

function typeWriter(text, elementId, speed = 50) {
  let i = 0;
  document.getElementById(elementId).textContent = "";
  function type() {
    if (i < text.length) {
      document.getElementById(elementId).textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

function updateLeaderboard() {
  const list = document.getElementById("leaderboard-list");
  list.innerHTML = "";
  leaderboard.sort((a, b) => b.score - a.score).slice(0, 5).forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.alias}: Score ${entry.score} (Time: ${entry.time}s)`;
    list.appendChild(li);
  });
}

function checkAnswer() {
  const input = document.getElementById("answer-input").value.trim().toLowerCase();
  const feedback = document.getElementById("feedback");
  const description = document.getElementById("level-description");
  const successSound = document.getElementById("success-sound");
  const errorSound = document.getElementById("error-sound");
  if (input === levels[currentLevel].answer) {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    score += Math.max(1000 - timeTaken * 10, 100);
    feedback.textContent = "Access Granted!";
    description.classList.add("correct");
    successSound.play().catch(() => console.log("Audio playback failed"));
    setTimeout(() => {
      description.classList.remove("correct");
      currentLevel++;
      if (currentLevel > totalLevels) {
        feedback.textContent = "You won the game!";
        leaderboard.push({ alias: hackerAlias, score, time: Math.floor((Date.now() - startTime) / 1000) });
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
        updateLeaderboard();
        document.getElementById("answer-input").style.display = "none";
        document.getElementById("level-description").textContent = `Congratulations, ${hackerAlias}!`;
        document.getElementById("progress-bar").style.width = "100%";
        return;
      }
      feedback.textContent = "";
      document.getElementById("answer-input").value = "";
      updateUI();
      levels[currentLevel].setup();
      typeWriter(levels[currentLevel].description, "level-description");
      startTime = Date.now();
    }, 1000);
  } else {
    feedback.textContent = "Access Denied. Try again!";
    errorSound.play().catch(() => console.log("Audio playback failed"));
  }
}