export const chunkArray = (myArray: any[], chunk_size: number) => {
    let index = 0;
    const arrayLength = myArray.length;
    const tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
        // Do something if you want with the group
        tempArray.push(myArray.slice(index, index + chunk_size));
    }

    return tempArray;
};
