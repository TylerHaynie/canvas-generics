export class RandomUtility{
    /// returns a random number between -1 and 1
    randomWithNegative() {
        return (((Math.random() * 200) - 100) / 100);
    }

    /// returns a random number between n1 and n2
    randomNumberBetween(n1, n2) {
        return Math.floor(Math.random() * Math.max(n1, n2)) + Math.min(n1, n2);
    }
}
