# Where to sit in [CVLab](http://cvlab.postech.ac.kr/lab/index.php)?
This repository provides a simple interface to determine where to sit in CVLab.

## How to use
### Prepare files
You have two files to control the seat assignment: `students.txt`, and `cvlab_seat_preference.csv`.

- `students.txt` should contain names of all students who participate to the raffle.
  - Students with priority (higher chance of early picks) are marked with an asterisk `*` (e.g., `John*`)
  - Students with depriority (moved to last picks) are marked with a minus sign `-` (e.g., `Jane-`)
  - Normal students have no suffix

- `cvlab_seat_preference.csv` shows seat preferences of each student. 
Each row contains {name}, {current seat}, {preference sequence} of a student.
To create this file, you may distribute this link (https://jinsingsangsung.github.io/where2sit/) to participants to create their rows,
and make people fill out the shared google spreadsheet. Make sure all people to use *copy to clipboard* button to ensure uniformity of each row.
<p align="center">
  <img src="https://github.com/user-attachments/assets/382231aa-5aba-4f00-a328-91316696bdc5" width="700"/>
</p>

### Run the seat assignment
Once you completed the above step, you may update both files of the repository.
Now you can go to https://jinsingsangsung.github.io/where2sit/seat_assignment.html to start the raffle!

### Priority System
The raffle system supports three priority levels:
- **Priority students (*)**: Get ranks 1-20 (shuffled among themselves)
- **Normal students**: Get middle ranks (shuffled among themselves)
- **Deprioritized students (-)**: Get the last ranks (shuffled among themselves)

This ensures fair randomization within each group while respecting priority/depriority preferences.
