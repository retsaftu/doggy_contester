#!/bin/bash

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
    echo "Compilation failed" >> ./../uploads/${contestId}/${taskId}/${userId}/cpp/compile.log
    exit 1
fi

mkdir ./../uploads/${contestId}/${taskId}/${userId}/cpp/output
mkdir ./../uploads/${contestId}/${taskId}/${userId}/cpp/result
mkdir ./../uploads/${contestId}/${taskId}/${userId}/cpp/error

testsAmount=$(ls ./../uploads/${contestId}/${taskId}/${userId}/cpp/input | wc -l)

for i in $(seq 1 $testsAmount); do
    START=$(date +%s.%3N)

    # Run program
    ./timeout -t 1 -m 1024 ./../uploads/${contestId}/${taskId}/${userId}/cpp/main \
        < ./../uploads/${contestId}/${taskId}/${userId}/cpp/input/test${i}.in \
        1> ./../uploads/${contestId}/${taskId}/${userId}/cpp/output/test${i}.out \
        2> ./../uploads/${contestId}/${taskId}/${userId}/cpp/error/test${i}.err

    END=$(date +%s.%3N)

    DIFF=$(echo "$END - $START" | bc)

    # Check if test failed
    # if [ -s ./../uploads/${contestId}/${taskId}/${userId}/cpp/compile.log ]; then
    #     echo "Error while compiling test ${i}" >> ./../uploads/${contestId}/${taskId}/${userId}/cpp/compile.log
    # fi

    j=1
    isUserAnswerCorrect=false

    while [[ -f ./../uploads/${contestId}/${taskId}/${userId}/cpp/correct/test${i}.answer${j}.out ]]
    do
        sed -i '$a\' ./../uploads/${contestId}/${taskId}/${userId}/cpp/correct/test${i}.answer${j}.out
        sed -i '$a\' ./../uploads/${contestId}/${taskId}/${userId}/cpp/output/test${i}.out

        # Compare user answer with correct answer
        diff ./../uploads/${contestId}/${taskId}/${userId}/cpp/output/test${i}.out \
            ./../uploads/${contestId}/${taskId}/${userId}/cpp/correct/test${i}.answer${j}.out \
            &> ./../uploads/${contestId}/${taskId}/${userId}/cpp/result/test${i}.out

        # Check if user answer is wrong or correct
        if [ -s ./../uploads/${contestId}/${taskId}/${userId}/cpp/result/test${i}.out ]; then
            isUserAnswerCorrect=false
        else
            isUserAnswerCorrect=true
            echo "Correct answer" >> ./../uploads/${contestId}/${taskId}/${userId}/cpp/result/test${i}.out
            break
        fi

        ((j++))
    done

    # Check if user answer is not correct
    if [ "$isUserAnswerCorrect" = false ]; then
        echo "Wrong answer" > ./../uploads/${contestId}/${taskId}/${userId}/cpp/result/test${i}.out
    fi

    echo ${DIFF} >> ./../uploads/${contestId}/${taskId}/${userId}/cpp/result/test${i}.out
done