pragma solidity ^0.4.21;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract WorldCupInfo is Ownable {

  struct MatchDay {
    uint date;
    Game[] games;
  }

  struct Game {
    uint homeCountry;
    uint awayCountry;
  }

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

  struct Player {
    string fullName;
    uint8 countryId;
  }

  Player[] public players;

  function WorldCupInfo() public {
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
