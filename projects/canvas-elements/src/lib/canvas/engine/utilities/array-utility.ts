export abstract class ArrayUtility {

    // may not work if code is minify'd
    public static findTypeInArray(type, array) {
        let compareType = type.name;
        for (let i = 0; i < array.length; i++) {
            if (compareType == array[i].constructor.name)
                return array[i];
        }
    }

}