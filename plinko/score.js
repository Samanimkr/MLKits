const outputs = [];
const k = 5;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
    // Ran every time a balls drops into a bucket
    outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
    const testSetSize = 50;
    const [testSet, trainingSet] = splitDataset(outputs, testSetSize);

    let numberCorrect = 0;
    for (i=0; i<testSet.length; i++) {
        const bucket = knn(trainingSet, testSet[i][0]);
        if (bucket === testSet[i][3]) {
            numberCorrect++
        }
    }
    console.log('Accuracy: ', numberCorrect / testSetSize);
}

const knn = (dataset, predictionPoint) => (
    _.chain(dataset)
        .map(row => [distance(row[0], predictionPoint), row[3]])
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

const distance = (pointA, pointB) => Math.abs(pointA - pointB);