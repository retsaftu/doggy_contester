#!/bin/bash

# ./cpp.sh -c [contestId] -t [taskId] -u [userId]

# ./cpp.sh -c 624d045b77da84a9578f547c -t 624d048dab2c664cb2b104ff -u 624d047e12db1453299521dc
# contestId 624d045b77da84a9578f547c
# taskId   624d048dab2c664cb2b104ff
# userId   624d047e12db1453299521dc

while getopts c:t:u: flag
do
    case "${flag}" in
        c) contestId=${OPTARG};;
        u) userId=${OPTARG};;
        t) taskId=${OPTARG};;
        *) echo "Usage: ./cpp.sh -c [contestId] -t [taskId] -u [userId]" && exit 1;;
    esac
done

# Compile code, create executable and write compile errors to compile.log file
g++ ./../uploads/${contestId}/${taskId}/${userId}/cpp/main.cpp \
    -o ./../uploads/${contestId}/${taskId}/${userId}/cpp/main \
    &> ./../uploads/${contestId}/${taskId}/${userId}/cpp/compile.log

# Check if compilation errors occurred and stop execution if they did
if [ -s ./../uploads/${contestId}/${taskId}/${userId}/cpp/compile.log ]; then
    echo "Compilation failed"
    exit 1
fi

mkdir ./../uploads/${contestId}/${taskId}/${userId}/cpp/output
mkdir ./../uploads/${contestId}/${taskId}/${userId}/cpp/error

testsAmount=$(ls ./../uploads/${contestId}/${taskId}/${userId}/cpp/input | wc -l)

for i in $(seq 1 $testsAmount); do
    # Run program
    ./../uploads/${contestId}/${taskId}/${userId}/cpp/main \
        < ./../uploads/${contestId}/${taskId}/${userId}/cpp/input/test${i}.in \
        1> ./../uploads/${contestId}/${taskId}/${userId}/cpp/output/test${i}.out \
        2> ./../uploads/${contestId}/${taskId}/${userId}/cpp/error/test${i}.err

    # Check if test failed
    if [ -s ./../uploads/${contestId}/${taskId}/${userId}/cpp/error/test${i}.err ]; then
        echo "Error on test ${i}"
        exit 1
    fi

    # Compare user answer with correct answer
    diff ./../uploads/${contestId}/${taskId}/${userId}/cpp/output/test${i}.out \
        ./../uploads/${contestId}/${taskId}/${userId}/cpp/correct/test${i}.ans \
        &> ./../uploads/${contestId}/${taskId}/${userId}/cpp/error/test${i}.err

    # Check if user answer is correct
    if [ -s ./../uploads/${contestId}/${taskId}/${userId}/cpp/error/test${i}.err ]; then
        echo "Wrong answer on test ${i}"
        exit 1
    fi
done

echo "Compilation successful"