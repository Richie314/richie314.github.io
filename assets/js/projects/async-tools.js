/**
 * @param {Function[]} arrayofFunctions
 * */
async function RunParallel(arrayofFunctions) {
    if (!arrayofFunctions)
        return;
    //console.log(arrayofFunctions)
    arrayofFunctions = arrayofFunctions.filter(f => typeof f === 'function');
    const arrayOfPromises = arrayofFunctions.map(
        (f, i, all) => new Promise((res, rej) => {
            try {
                res(f());
            } catch (err) {
                rej(err);
            }
        })
    );
    //console.log(arrayOfPromises);
    return await Promise.all(arrayOfPromises);
}
async function delay(time) {
    if (!time || isNaN(time))
        return;
    return await new Promise(resolve => setTimeout(resolve, time));
}