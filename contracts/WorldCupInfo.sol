pragma solidity ^0.4.23;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/// @title The contract that manages all player, game, and country info for the 2018 World Cup
/// @author The CryptoStrikers Team
contract WorldCupInfo is Ownable {
  // Explain the data structures, deployment, what is mutable
  //
  //  - The 32 countries are just strings of the country name, indexed by id
  //    (see countries array). This doesn't need to be mutable?
  //
  //  - Players mutable?
  //
  //  - Games/GameDays need to be modifiable in case of re-scheduling!

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

  // game belongs to gameday? or gameday has game? both?
  struct Game {
    uint8 homeCountryId;
    uint8 awayCountryId;
  }

  struct GameDay {
    uint date;
    Game[] games;
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

  /// @dev why we chose to initialize here?
  ///  Ordered by country ID (see countries array)
  constructor() public {
    players.push(Player("Lionel Messi", 0));
    players.push(Player("Sergio Agüero", 0));
    players.push(Player("Eden Hazard", 2));
    players.push(Player("Kevin De Bruyne", 2));
    players.push(Player("Thibaut Courtois", 2));
    players.push(Player("Neymar", 3));
    players.push(Player("Dani Alves", 3));
    players.push(Player("Marcelo", 3));
    players.push(Player("Luka Modrić", 6));
    players.push(Player("Christian Eriksen", 7));
    players.push(Player("Mohamed Salah", 8));
    players.push(Player("Harry Kane", 9));
    players.push(Player("Paul Pogba", 10));
    players.push(Player("N'Golo Kanté", 10));
    players.push(Player("Antoine Griezmann", 10));
    players.push(Player("Toni Kroos", 11));
    players.push(Player("Mats Hummels", 11));
    players.push(Player("Mesut Özil", 11));
    players.push(Player("Robert Lewandowski", 20));
    players.push(Player("Cristiano Ronaldo", 21));
    players.push(Player("Thiago", 27));
    players.push(Player("Sergio Ramos", 27));
    players.push(Player("David De Gea", 27));
    players.push(Player("Edinson Cavani", 31));
    players.push(Player("Luis Suárez", 31));
  }
}
