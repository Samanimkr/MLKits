const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
    // Ran every time a balls drops into a bucket
    outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

// Uncomment for finding out how much does each feature affect the accuracy
// function runAnalysis() {
//     const testSetSize = 100;
//     const k = 10;


//     _.range(0, 3).forEach(feature => {
//         const data = _.map(outputs, row => [row[feature], _.last(row)])
//         const [testSet, trainingSet] = splitDataset(minMaxNormalisation(data, 1), testSetSize);

//         const accuracy = _.chain(testSet)
//             .filter(testPoint => (
//                 knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint)
//             ))
//             .size()
//             .divide(testSetSize)
//             .value();

//         console.log(`For feature=${feature}, accuracy: ${accuracy}`);
//     });
// }

function runAnalysis() {
    const testSetSize = 100;
    const [testSet, trainingSet] = splitDataset(outputs, testSetSize);

    _.range(1, 20).forEach(k => {
        const accuracy = _.chain(testSet)
            .filter(testPoint => (
                knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint)
            ))
            .size()
            .divide(testSetSize)
            .value();

        console.log(`For k=${k}, accuracy: ${accuracy}`);
    });
}

const knn = (dataset, predictionPoint, k) => (
    // predictionPoint shouldn't be passed in with the label
    _.chain(dataset)
        .map(row => [
            distance(_.initial(row), predictionPoint),
            _.last(row)
        ])
        .sortBy(row => row[0])
        .slice(0, k)
        .countBy(row => row[1])
        .toPairs()
        .sortBy(row => row[1])
        .last()
        .first()
        .parseInt()
        .value()
);

const splitDataset = (dataset, testCount) => {
    const shuffled = _.shuffle(dataset);

    const testSet = _.slice(shuffled, 0, testCount);
    const trainingSet = _.slice(shuffled, testCount);

    return [testSet, trainingSet];
}

const distance = (pointA, pointB) => (
    _.chain(pointA)
        .zip(pointB)
        .map(([a, b]) => (a - b) ** 2)
        .sum()
        .value() ** 0.5
);

// Uncomment for normalising the data (makes the ball bounciness and ball size just as effective as the drop position)
// const minMaxNormalisation = (data, featureCount) => {
//     const clonedData = _.cloneDeep(data)

//     for (let columnIndex = 0; columnIndex < featureCount; columnIndex++) {
//         const column = clonedData.map(row => row[columnIndex]);

//         const min = _.min(column);
//         const max = _.max(column);

//         for (let rowIndex = 0; rowIndex < clonedData.length; rowIndex++) {
//             // Normalising the data
//             clonedData[rowIndex][columnIndex] = (clonedData[rowIndex][columnIndex]) / (max - min);
//         }
//     }

//     return clonedData;
// }