// Debug script to test chain generation with realistic data

function generateMoveChains(assignments, studentToCurrentSeat) {
    const chains = [];
    const processedStudents = new Set();

    // Build reverse mapping: who points to each student
    const pointedToBy = {}; // student -> who points to them
    for (const [student, assignedSeat] of Object.entries(assignments)) {
        const whoSitsThere = Object.keys(studentToCurrentSeat)
            .find(s => studentToCurrentSeat[s] === assignedSeat);
        if (whoSitsThere && assignments[whoSitsThere]) {
            pointedToBy[whoSitsThere] = student;
        }
    }

    console.log("pointedToBy:", pointedToBy);

    // Process each student who got a new assignment
    for (const [startStudent, newSeat] of Object.entries(assignments)) {
        console.log(`\n=== Checking ${startStudent} ===`);

        if (processedStudents.has(startStudent)) {
            console.log(`  Already processed, skip`);
            continue;
        }

        // Skip if someone points to this student (they're not a chain head)
        // Exception: if this student is part of a cycle that hasn't been processed
        if (pointedToBy[startStudent]) {
            console.log(`  ${startStudent} is pointed to by ${pointedToBy[startStudent]}`);

            // Check if this forms a cycle by following the chain
            let current = startStudent;
            let steps = 0;
            const maxSteps = Object.keys(assignments).length + 1;

            while (current && steps < maxSteps) {
                const nextSeat = assignments[current];
                if (!nextSeat) break;

                const nextStudent = Object.keys(studentToCurrentSeat)
                    .find(s => studentToCurrentSeat[s] === nextSeat);

                console.log(`    ${current} -> seat ${nextSeat} -> ${nextStudent}`);

                if (nextStudent === startStudent) {
                    console.log(`    Found cycle back to ${startStudent}!`);
                    // Found a cycle! This is OK to process
                    break;
                }

                if (!nextStudent || !assignments[nextStudent]) break;
                current = nextStudent;
                steps++;
            }

            // If we didn't find a cycle back to startStudent, skip this student
            if (current !== startStudent) {
                console.log(`  Not a cycle, skipping ${startStudent}`);
                continue;
            }
            console.log(`  Is a cycle, processing ${startStudent}`);
        } else {
            console.log(`  ${startStudent} is NOT pointed to - chain head!`);
        }

        const chain = [];
        const studentsInChain = new Set();
        let currentStudent = startStudent;
        let isCycle = false;

        // Follow the chain
        while (currentStudent && !studentsInChain.has(currentStudent)) {
            const currentSeat = studentToCurrentSeat[currentStudent];
            const assignedSeat = assignments[currentStudent];

            if (!assignedSeat) break;

            chain.push({
                student: currentStudent,
                currentSeat: currentSeat,
                newSeat: assignedSeat
            });

            studentsInChain.add(currentStudent);
            processedStudents.add(currentStudent);

            // Find who currently sits in the seat this student is moving to
            const nextStudent = Object.keys(studentToCurrentSeat)
                .find(student => studentToCurrentSeat[student] === assignedSeat);

            // Check if this completes a cycle
            if (nextStudent === startStudent) {
                isCycle = true;
                break;
            }

            // Check if next student also got a new assignment (continues the chain)
            if (nextStudent && assignments[nextStudent]) {
                currentStudent = nextStudent;
            } else {
                break;
            }
        }

        console.log(`  Built chain: ${chain.map(n => n.student).join(' -> ')}`);

        // Only add chains with at least 1 move
        if (chain.length >= 1) {
            chains.push({
                nodes: chain,
                isCycle: isCycle
            });
        }
    }

    return chains;
}

// Test case based on your screenshot: overlapping chains ending with same sequence
console.log("=== TEST: Overlapping chains ===\n");

// Chain 1: 이진희 (31) → 조은찬 (15) → 김만진 (29) → 34
// Chain 15: 정윤우 (32) → 이진희 (31) → 조은찬 (15) → 김만진 (29) → 34
// Chain 16: 김동근 (47) → 이소현 (14) → 정윤우 (32) → 이진희 (31) → 조은찬 (15) → 김만진 (29) → 34

const assignments = {
    '김동근': 14,  // moves to 이소현's seat
    '이소현': 32,  // moves to 정윤우's seat
    '정윤우': 31,  // moves to 이진희's seat
    '이진희': 15,  // moves to 조은찬's seat
    '조은찬': 29,  // moves to 김만진's seat
    '김만진': 34   // moves to empty seat 34
};

const currentSeats = {
    '김동근': 47,
    '이소현': 14,
    '정윤우': 32,
    '이진희': 31,
    '조은찬': 15,
    '김만진': 29
};

const chains = generateMoveChains(assignments, currentSeats);

console.log(`\n=== RESULTS ===`);
console.log(`Total chains: ${chains.length}`);
chains.forEach((c, i) => {
    const chainStr = c.nodes.map(n => `${n.student} (${n.currentSeat})`).join(' → ');
    const lastNode = c.nodes[c.nodes.length - 1];
    console.log(`Chain ${i+1}: ${chainStr} → ${lastNode.newSeat}`);
});

console.log(`\nExpected: 1 chain (김동근 → 이소현 → 정윤우 → 이진희 → 조은찬 → 김만진 → 34)`);
console.log(`Result: ${chains.length === 1 ? '✅ PASS' : '❌ FAIL'}`);
