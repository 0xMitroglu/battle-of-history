// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Characters {
    struct Person {
        string tokenUri;
        uint256 attack;
        uint256 defence;
        uint256 tactics;
    }
    Person[] public normalPersons;
    Person[] public rarePersons;
    Person[] public legendaryPersons;

    constructor(
        string[] memory tokenUriNormal,
        uint256[][] memory normalStats,
        string[] memory tokenUriRare,
        uint256[][] memory statsRare,
        string[] memory tokenUriLegendary,
        uint256[][] memory statsLegendary
    ) {
        for (uint256 i = 0; i < tokenUriNormal.length; i++) {
            normalPersons.push(
                Person(
                    tokenUriNormal[i],
                    normalStats[i][0],
                    normalStats[i][1],
                    normalStats[i][2]
                )
            );
        }
        for (uint256 i = 0; i < tokenUriRare.length; i++) {
            rarePersons.push(
                Person(
                    tokenUriRare[i],
                    statsRare[i][0],
                    statsRare[i][1],
                    statsRare[i][2]
                )
            );
        }
        for (uint256 i = 0; i < tokenUriLegendary.length; i++) {
            legendaryPersons.push(
                Person(
                    tokenUriLegendary[i],
                    statsLegendary[i][0],
                    statsLegendary[i][1],
                    statsLegendary[i][2]
                )
            );
        }
    }

    function normalPersonsLength() public view returns (uint256) {
        return normalPersons.length;
    }

    function rarePersonsLength() public view returns (uint256) {
        return rarePersons.length;
    }

    function legendaryPersonsLength() public view returns (uint256) {
        return legendaryPersons.length;
    }
}
