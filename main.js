document
  .getElementById('run-btn')
  .addEventListener('click', runBankersAlgorithm);

function runBankersAlgorithm() {
  const numProcesses = 5;
  const numResources = 3;

  // 1. Fetch Available Resource Array from UI
  let available = [
    parseInt(document.getElementById('avail-A').value) || 0,
    parseInt(document.getElementById('avail-B').value) || 0,
    parseInt(document.getElementById('avail-C').value) || 0,
  ];

  let allocation = [];
  let max = [];
  let need = [];

  // 2. Extract input values dynamically from UI fields to build matrices
  for (let i = 0; i < numProcesses; i++) {
    let allocInputs = document.querySelectorAll(`.alloc-${i}`);
    let maxInputs = document.querySelectorAll(`.max-${i}`);

    let allocRow = Array.from(allocInputs).map(
      (input) => parseInt(input.value) || 0
    );
    let maxRow = Array.from(maxInputs).map(
      (input) => parseInt(input.value) || 0
    );

    allocation.push(allocRow);
    max.push(maxRow);

    // Compute Need Row right away: Need = Max - Allocation
    let needRow = [];
    for (let j = 0; j < numResources; j++) {
      needRow.push(maxRow[j] - allocRow[j]);
    }
    need.push(needRow);
  }

  // Initialize state evaluation containers
  let finish = new Array(numProcesses).fill(false);
  let work = [...available];
  let safeSequence = [];

  // 3. Safety Algorithm Core Loop Execution
  let count = 0;
  while (count < numProcesses) {
    let found = false;

    for (let p = 0; p < numProcesses; p++) {
      if (!finish[p]) {
        let j;
        // Check if resource needs can be entirely met by work pool
        for (j = 0; j < numResources; j++) {
          if (need[p][j] > work[j]) break;
        }

        // If process criteria is met, release its held resources
        if (j === numResources) {
          for (let k = 0; k < numResources; k++) {
            work[k] += allocation[p][k];
          }
          safeSequence.push(`P${p}`);
          finish[p] = true;
          found = true;
          count++;
        }
      }
    }

    // If an iteration passes without satisfying any process requirement -> Deadlock trap
    if (!found) {
      const outputDiv = document.getElementById('output');
      outputDiv.className = 'unsafe';
      outputDiv.innerHTML =
        '❌ SYSTEM STATE: UNSAFE!<br>The current allocation parameters lead to a Deadlock. No clear execution path exists.';
      return;
    }
  }

  // 4. Output the Successful Sequence Result
  const outputDiv = document.getElementById('output');
  outputDiv.className = 'safe';
  outputDiv.innerHTML = `✔️ SYSTEM STATE: SAFE!<br>Execution Safe Sequence Path: <strong>${safeSequence.join(
    ' ➔ '
  )}</strong>`;
}
