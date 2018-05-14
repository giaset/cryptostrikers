pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/// @title The contract that manages all player and country info for the 2018 World Cup
/// @author The CryptoStrikers Team
contract WorldCupInfo is Ownable {
  // Explain the data structures, deployment, what is mutable
  //
  //  - The 32 countries are just strings of the country name, indexed by id
  //    (see countries array). This doesn't need to be mutable?
  //
  //  - Players mutable?

  /*** DATA TYPES ***/

  /// @dev Regardless of series or run, a CryptoStrikers card
  ///  always represents one (and only one) soccer player.
  struct Player {
    // Turns out soccer players can get pretty wild with their names,
    // so it's easier to just have one field for their most commonly
    // used name. We wanted to avoid something like:
    // commonName: "Cristiano Ronaldo"
    // firstName: "C. Ronaldo"
    // lastName: "dos Santos Aveiro"
    // name: "Cristiano Ronaldo"
    // see: https://www.easports.com/fifa/ultimate-team/api/fut/item
    string fullName;

    // Index into the countries array, which only has 32 values,
    // so uint8 (0-255) is fine here...
    uint8 countryId;
  }

  /*** STORAGE ***/

  /// @dev The 32 countries participating in the World Cup,
  ///  ordered alphabetically. A country's ID corresponds
  ///  to its index in this array.
  string[] public countries = [
    "Argentina", "Australia", "Belgium", "Brazil",
    "Colombia", "Costa Rica", "Croatia", "Denmark",
    "Egypt", "England", "France", "Germany",
    "Iceland", "Iran", "Japan", "Mexico",
    "Morocco", "Nigeria", "Panama", "Peru",
    "Poland", "Portugal", "Russia", "Saudi Arabia",
    "Senegal", "Serbia", "South Korea", "Spain",
    "Sweden", "Switzerland", "Tunisia", "Uruguay"
  ];

  /// @dev Array containing all 100 players for which we will issue cards.
  ///  Each player's ID corresponds to their index in the array
  Player[] public players;

  /// @dev Load the players here because otherwise it's super annoying
  ///   to push in a bunch of structs. Players are loosely ordered by
  ///   skill, as ranked by the CryptoStrikers team (feel free to scream
  ///   at us on Twitter).
  constructor() public {
    // 0
    players.push(Player("Lionel Messi", 0));
    // 1
    players.push(Player("Cristiano Ronaldo", 21));
    // 2
    players.push(Player("Neymar", 3));
    // 3
    players.push(Player("Mohamed Salah", 8));
    // 4
    players.push(Player("Robert Lewandowski", 20));
    // 5
    players.push(Player("Kevin De Bruyne", 2));
    // 6
    players.push(Player("Luka Modrić", 6));
    // 7
    players.push(Player("Eden Hazard", 2));
    // 8
    players.push(Player("Sergio Ramos", 27));
    // 9
    players.push(Player("Toni Kroos", 11));
    // 10
    players.push(Player("Luis Suárez", 31));
    // 11
    players.push(Player("Harry Kane", 9));
    // 12
    players.push(Player("Sergio Agüero", 0));
    // 13
    players.push(Player("Kylian Mbappé", 10));
    // 14
    players.push(Player("Gonzalo Higuaín", 0));
    // 15
    players.push(Player("David De Gea", 27));
    // 16
    players.push(Player("Antoine Griezmann", 10));
    // 17
    players.push(Player("N'Golo Kanté", 10));
    // 18
    players.push(Player("Edinson Cavani", 31));
    // 19
    players.push(Player("Paul Pogba", 10));
    // 20
    players.push(Player("Isco", 27));
    // 21
    players.push(Player("Marcelo", 3));
    // 22
    players.push(Player("Manuel Neuer", 11));
    // 23
    players.push(Player("Dries Mertens", 2));
    // 24
    players.push(Player("James Rodríguez", 4));

    // Unranked
    players.push(Player("Thiago Silva", 3));
    players.push(Player("David Silva", 27));
    players.push(Player("Thibaut Courtois", 2));
    players.push(Player("Christian Eriksen", 7));
    players.push(Player("Ángel Di María", 0));
    players.push(Player("Ivan Rakitić", 6));
    players.push(Player("Dele Alli", 9));
    players.push(Player("Philippe Coutinho", 3));
    players.push(Player("Thiago", 27));
    players.push(Player("Mesut Özil", 11));
    players.push(Player("Hugo Lloris", 10));
    players.push(Player("Dani Alves", 3));
    players.push(Player("Radamel Falcao", 4));
    players.push(Player("Mats Hummels", 11));
    players.push(Player("Andrés Iniesta", 27));
    players.push(Player("Romelu Lukaku", 2));
    players.push(Player("Sadio Mané", 24));
    players.push(Player("Son Heung-min", 26));
    players.push(Player("Javier Hernández", 15));
    players.push(Player("Casemiro", 3));
    players.push(Player("Diego Godín", 31));
    players.push(Player("Kalidou Koulibaly", 24));
    players.push(Player("Keylor Navas", 5));
    players.push(Player("Raheem Sterling", 9));
    players.push(Player("Gerard Piqué", 27));
  }
}
