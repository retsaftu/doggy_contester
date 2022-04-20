#!/bin/bash

while getopts c:t:u: flag
do
    case "${flag}" in
        c) contestId=${OPTARG};;
        u) userId=${OPTARG};;
        t) taskId=${OPTARG};;
        *) echo "Usage: ./js.sh -c [contestId] -t [taskId] -u [userId]" && exit 1;;
    esac
done

touch ./../uploads/${contestId}/${taskId}/${userId}/js/compile.log

mkdir ./../uploads/${contestId}/${taskId}/${userId}/js/output
mkdir ./../uploads/${contestId}/${taskId}/${userId}/js/result
mkdir ./../uploads/${contestId}/${taskId}/${userId}/js/error

testsAmount=$(ls ./../uploads/${contestId}/${taskId}/${userId}/js/input | wc -l)

for i in $(seq 1 $testsAmount); do
    START=$(date +%s.%3N)

    # Run program
    ./timeout -t 1 -m 1024 node ./../uploads/${contestId}/${taskId}/${userId}/js/main \
        < ./../uploads/${contestId}/${taskId}/${userId}/js/input/test${i}.in \
        1> ./../uploads/${contestId}/${taskId}/${userId}/js/output/test${i}.out \
        2> ./../uploads/${contestId}/${taskId}/${userId}/js/error/test${i}.err

    END=$(date +%s.%3N)

    DIFF=$(echo "$END - $START" | bc)

    j=1
    isUserAnswerCorrect=false

    while [[ -f ./../uploads/${contestId}/${taskId}/${userId}/js/correct/test${i}.answer${j}.out ]]
    do
        sed -i '$a\' ./../uploads/${contestId}/${taskId}/${userId}/js/correct/test${i}.answer${j}.out
        sed -i '$a\' ./../uploads/${contestId}/${taskId}/${userId}/js/output/test${i}.out

        # Compare user answer with correct answer
        diff ./../uploads/${contestId}/${taskId}/${userId}/js/output/test${i}.out \
            ./../uploads/${contestId}/${taskId}/${userId}/js/correct/test${i}.answer${j}.out \
            &> ./../uploads/${contestId}/${taskId}/${userId}/js/result/test${i}.out

        # Check if user answer is wrong or correct
        if [ -s ./../uploads/${contestId}/${taskId}/${userId}/js/result/test${i}.out ]; then
            isUserAnswerCorrect=false
        else
            isUserAnswerCorrect=true
            echo "Correct answer" >> ./../uploads/${contestId}/${taskId}/${userId}/js/result/test${i}.out
            break
        fi

        ((j++))
    done

    # Check if user answer is not correct
    if [ "$isUserAnswerCorrect" = false ]; then
        echo "Wrong answer" > ./../uploads/${contestId}/${taskId}/${userId}/js/result/test${i}.out
    fi

    echo ${DIFF} >> ./../uploads/${contestId}/${taskId}/${userId}/js/result/test${i}.out
done