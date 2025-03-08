//Here are all the cardUris
const bismarck = [
    "ipfs://QmV7UcTfxBHdaDVFQ5qfC4iWdnWoAynXQavhKpp2B5Vp2L",
    "ipfs://QmTui3NXCa9eyRTHkJgALcRAbqrr8PfmMjcRq9cmxbvp1o",
    "ipfs://QmSU2gmAPX8X3eknzvr8NBqhByWp67bJ9zUMznGdST7dgZ",
]
const stalin = [
    "ipfs://QmSpWbVxKLLrtJdfCWmQ91yvdsnBbtu9UQiwsMXyYRfmeX",
    "ipfs://QmVGmJPTGzZbRy6X5Wp7MTM2k9nMjmWX2rbZmHCmpiW5D4",
    "ipfs://QmQ2Sc2M3XrmzXpWRiX4KDiJ3gKjG2fz8gbcwg3HkkLZaP",
]
const caesar = [
    "ipfs://QmXqeGZbL1K7j9C48Qd3H9HAmMBJ9YQvR2hjjzEy2w3q22",
    "ipfs://QmTQfBFvQh8popHFHFcfGXKfms3zqDFRq9j4Gvh6iQeGbG",
    "ipfs://QmZnCDsW7BTkoGN9ZKDf2GKZzWzfxRHofgg7mFTf2pYK4t",
]
const colombus = [
    "ipfs://QmTLf4eg3qwB3VAMSbZ6G8RN2yPrJVM8WhEiEaxS26XNJw",
    "ipfs://QmcMW5s33nt4XQG92uuAoW3UamxqgherBBinu2ASa7x2LT",
    "ipfs://QmW8dy2wE5EKWp7gCz3Mioe5VoiYTkBTJPNWMPWUzNhbwj",
]
const mussolini = [
    "ipfs://QmakJREkCHmNqTNtiZhyPt3K4cZxy51mstgPuUXci7xV4B",
    "ipfs://QmUpWVJxywgENytT92nvPNmWjaeDuaRtf5jcQDw1Vi7s9w",
    "ipfs://QmNUYxw5XLRTugzk7EGgqoPXP5kv8PpqgoNn8ZUvj1KtcU",
]
const normalUri = [bismarck[0], stalin[0], caesar[0], colombus[0], mussolini[0]]
const normalStats = [
    [50, 55, 54],
    [55, 58, 64],
    [63, 55, 68],
    [53, 52, 57],
    [67, 63, 61],
]
const rareUri = [bismarck[1], stalin[1], caesar[1], colombus[1], mussolini[1]]
const rareStats = [
    [65, 70, 74],
    [70, 73, 79],
    [80, 78, 81],
    [63, 61, 67],
    [80, 78, 75],
]

const legendaryUri = [
    bismarck[2],
    stalin[2],
    caesar[2],
    colombus[2],
    mussolini[2],
]
const legendaryStats = [
    [90, 85, 89],
    [90, 91, 98],
    [95, 89, 99],
    [88, 78, 82],
    [96, 91, 90],
]
module.exports = {
    normalUri,
    normalStats,
    rareUri,
    rareStats,
    legendaryUri,
    legendaryStats,
}
