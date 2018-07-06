pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./StrikersBase.sol";

contract StrikersUpdate is Ownable {

  event PickMade(address indexed user, uint8 indexed game, uint256 cardId);
  event CardUpgraded(address indexed user, uint8 indexed game, uint256 cardId);

  uint8 constant CHECKLIST_ITEM_COUNT = 132;
  uint8 constant GAME_COUNT = 8;

  mapping (uint256 => uint8) starCountForCard;
  mapping (address => uint256[GAME_COUNT]) public picksForUser;

  struct Game {
    uint8[] acceptedPlayers;
    uint32 startTime;
    uint8 homeTeam;
    uint8 awayTeam;
  }

  Game[] public games;

  StrikersBase public strikersBaseContract;

  constructor(address _strikersBaseAddress) public {
    strikersBaseContract = StrikersBase(_strikersBaseAddress);

    /*** QUARTER-FINALS ***/

    // 57 - FRIDAY JULY 6 2018 10:00 AM ET (URUGUAY / FRANCE)
    Game memory game57;
    game57.startTime = 1530885600;
    game57.homeTeam = 31;
    game57.awayTeam = 10;
    games.push(game57);
    games[0].acceptedPlayers = [10, 13, 16, 17, 18, 19, 37, 41, 51];

    // 58 - FRIDAY JULY 6 2018 02:00 PM ET (BRAZIL / BELGIUM)
    Game memory game58;
    game58.startTime = 1530900000;
    game58.homeTeam = 3;
    game58.awayTeam = 2;
    games.push(game58);
    games[1].acceptedPlayers = [2, 5, 7, 21, 23, 28, 30, 31, 33, 34, 45, 50, 60, 62];

    // 60 - SATURDAY JULY 7 2018 10:00 AM ET (SWEDEN / ENGLAND)
    Game memory game60;
    game60.startTime = 1530972000;
    game60.homeTeam = 28;
    game60.awayTeam = 9;
    games.push(game60);
    games[2].acceptedPlayers = [11, 40, 48, 63, 72, 79];

    // 59 - SATURDAY JULY 7 2018 02:00 PM ET (RUSSIA / CROATIA)
    Game memory game59;
    game59.startTime = 1530986400;
    game59.homeTeam = 22;
    game59.awayTeam = 6;
    games.push(game59);
    games[3].acceptedPlayers = [6, 43, 64, 70, 81];

    /*** SEMI-FINALS ***/

    // 61 - TUESDAY JULY 10 2018 02:00 PM ET (W57 / W58)
    Game memory game61;
    game61.startTime = 1531245600;
    games.push(game61);

    // 62 - WEDNESDAY JULY 11 2018 02:00 PM ET (W59 / W60)
    Game memory game62;
    game62.startTime = 1531332000;
    games.push(game62);

    /*** THIRD PLACE ***/

    // 63 - SATURDAY JULY 14 2018 11:00 AM ET (L61 / L62)
    Game memory game63;
    game63.startTime = 1531580400;
    games.push(game63);

    /*** FINAL ***/

    // 64 - SUNDAY JULY 15 2018 11:00 AM ET (W61 / W62)
    Game memory game64;
    game64.startTime = 1531666800;
    games.push(game64);
  }

  function updateGame(uint8 _game, uint8[] _acceptedPlayers, uint32 _startTime, uint8 _homeTeam, uint8 _awayTeam) external onlyOwner {
    Game storage game = games[_game];
    game.acceptedPlayers = _acceptedPlayers;
    game.startTime = _startTime;
    game.homeTeam = _homeTeam;
    game.awayTeam = _awayTeam;
  }

  function getGame(uint8 _game)
    external
    view
    returns (
    uint8[] acceptedPlayers,
    uint32 startTime,
    uint8 homeTeam,
    uint8 awayTeam
  ) {
    Game memory game = games[_game];
    acceptedPlayers = game.acceptedPlayers;
    startTime = game.startTime;
    homeTeam = game.homeTeam;
    awayTeam = game.awayTeam;
  }

  // There's actually no way for us to check that the submitted card features
  // an acceptedPlayer, but because there's 0 upside or downside to submitting
  // a card featuring an invalid player, it doesn't really matter...
  function makePick(uint8 _game, uint256 _cardId) external {
    Game memory game = games[_game];
    require(now < game.startTime, "This game has already started.");
    require(strikersBaseContract.ownerOf(_cardId) == msg.sender, "You don't own this card.");
    picksForUser[msg.sender][_game] = _cardId;
    emit PickMade(msg.sender, _game, _cardId);
  }

  function updateCards(uint8 _game, uint256[] _cardIds) external onlyOwner {
    for (uint256 i = 0; i < _cardIds.length; i++) {
      uint256 cardId = _cardIds[i];
      starCountForCard[cardId]++;
      address owner = strikersBaseContract.ownerOf(cardId);
      emit CardUpgraded(owner, _game, cardId);
    }
  }

  function getPicksForUser(address _user) external view returns (uint256[GAME_COUNT]) {
    return picksForUser[_user];
  }

  function starCountsForOwner(address _owner) external view returns (uint8[]) {
    uint256[] memory cardIds;
    (cardIds,) = strikersBaseContract.cardAndChecklistIdsForOwner(_owner);
    uint256 cardCount = cardIds.length;
    uint8[] memory starCounts = new uint8[](cardCount);

    for (uint256 i = 0; i < cardCount; i++) {
      uint256 cardId = cardIds[i];
      starCounts[i] = starCountForCard[cardId];
    }

    return starCounts;
  }

  function getMintedCounts() external view returns (uint16[CHECKLIST_ITEM_COUNT]) {
    uint16[CHECKLIST_ITEM_COUNT] memory mintedCounts;

    for (uint8 i = 0; i < CHECKLIST_ITEM_COUNT; i++) {
      mintedCounts[i] = strikersBaseContract.mintedCountForChecklistId(i);
    }

    return mintedCounts;
  }
}
