# Bash compiler

When POST request to /submission is done, save the file into

> /uploads/[:contestId]/[:taskId]/[:userId]/[:language]/main.[:language]

Get input tests for a task from database and save each input in separate file inside

> /uploads/[:contestId]/[:taskId]/[:userId]/[:language]/input/

Filename of each test input should be test[:testNumber].txt

Then run script from /compiler folder

./cpp.sh -c [contestId] -t [taskId] -u [userId]