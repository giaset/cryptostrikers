pragma solidity ^0.4.24;

import './StrikersPlayerList.sol';

/// @title The contract that manages checklist items, sets, and rarity tiers.
/// @author The CryptoStrikers Team
contract StrikersChecklist is StrikersPlayerList {
  // Here are the names our frontend uses for the
  // various sets and rarity tiers:
  //
  // Set ID 0 = Originals
  // Set ID 1 = Iconics
  //
  // (NB: We have the ability to create extra sets,
  //  but can't add to these two once they've been
  //  initialized)
  //
  // Rarity Tier 0 = Iconic (Referral Awards - uncapped)
  // Rarity Tier 1 = Iconic (Card of the Day Insert)
  // Rarity Tier 2 = Diamond
  // Rarity Tier 3 = Gold
  // Rarity Tier 4 = Silver
  // Rarity Tier 5 = Bronze

  /// @dev We initialize this contract with so much data that we have
  ///   to stage it in 4 different steps, ~33 checklist items at a time.
  enum DeployStep {
    WaitingForStepOne,
    WaitingForStepTwo,
    WaitingForStepThree,
    WaitingForStepFour,
    DoneInitialDeploy
  }

  /// @dev Enum containing all our rarity tiers, just because
  ///   it's cleaner dealing with these values than with uint8s.
  enum RarityTier {
    IconicReferral,
    IconicInsert,
    Diamond,
    Gold,
    Silver,
    Bronze
  }

  /// @dev A lookup table indicating how limited the cards
  ///   in each tier are. If this value is 0, it means
  ///   that cards of this rarity tier are unlimited,
  ///   which is only the case for the 8 Iconics cards
  ///   we give away as part of our referral program.
  uint16[] public tierLimits = [
    0,    // Iconic - Referral Bonus (uncapped)
    100,  // Iconic Inserts ("Card of the Day")
    1000, // Diamond
    1664, // Gold
    3328, // Silver
    4352  // Bronze
  ];

  /// @dev ChecklistItem is essentially the parent class to Card.
  ///   It represents a given superclass of cards (eg Originals Messi),
  ///   and then each Card is an instance of this ChecklistItem, with
  ///   its own serial number, mint date, etc.
  struct ChecklistItem {
    uint8 playerId;
    RarityTier tier;
  }

  /// @dev How many checklistItems we've created so far.
  uint8 public checklistItemCount;

  /// @dev The ID of the set we are currently minting.
  uint8 public currentSetId;

  /// @dev The deploy step we're at. Defaults to WaitingForStepOne.
  DeployStep public deployStep;

  /// @dev Returns all the checklist items for a given set.
  mapping (uint8 => ChecklistItem[]) public checklistItemsForSet;

  /// @dev External function to add a checklist item to the currentSetId. Must have completed initial deploy.
  /// @param _playerId The player represented by this checklist item. (see StrikersPlayerList.sol)
  /// @param _tier This checklist item's rarity tier. (see Rarity Tier enum and corresponding tierLimits)
  function addChecklistItem(uint8 _playerId, RarityTier _tier) external onlyOwner {
    require(deployStep == DeployStep.DoneInitialDeploy, "Finish deploying the Originals and Iconics sets first.");
    _addChecklistItem(_playerId, _tier);
  }

  /// @dev Internal function to add a checklist item to the currentSetId.
  /// @param _playerId The player represented by this checklist item. (see StrikersPlayerList.sol)
  /// @param _tier This checklist item's rarity tier. (see Rarity Tier enum and corresponding tierLimits)
  function _addChecklistItem(uint8 _playerId, RarityTier _tier) internal {
    require(checklistItemCount < 255, "You can't add any more checklist items.");
    require(_playerId < playerCount, "This player doesn't exist in our player list.");
    checklistItemsForSet[currentSetId].push(ChecklistItem({
      playerId: _playerId,
      tier: _tier
    }));
    checklistItemCount++;
  }

  /// @dev Returns how many checklist items we've added to a given set.
  function checklistItemCountForSet(uint8 _setId) external view returns (uint256) {
    return checklistItemsForSet[_setId].length;
  }

  // In the next four functions, we initialize this contract with our
  // 132 initial checklist items (100 Originals, 32 Iconics). Because
  // of how much data we need to store, it has to be broken up into
  // four different function calls, which need to be called in sequence.
  // The ordering of the checklist items we add determines their
  // checklist ID, which is left-padded in our frontend to be a
  // 3-digit identifier where the first digit is the setId and the last
  // 2 digits represents the checklist items index in checklistItemsForSet[setId].
  // For example, Originals Messi is the first item for set ID 0, and this
  // is displayed as #000 throughout the app. Our Card struct declare its
  // checklistId property as uint8, so we have
  // to be mindful that we can only have 256 total checklist items.

  /// @dev Deploys Originals #000 through #032.
  function deployStepOne() external onlyOwner {
    require(deployStep == DeployStep.WaitingForStepOne, "You're not following the steps in order...");

    /* ORIGINALS - DIAMOND */
    _addChecklistItem(0, RarityTier.Diamond); // Messi
    _addChecklistItem(1, RarityTier.Diamond); // Ronaldo
    _addChecklistItem(2, RarityTier.Diamond); // Neymar
    _addChecklistItem(3, RarityTier.Diamond); // Salah

    /* ORIGINALS - GOLD */
    _addChecklistItem(4, RarityTier.Gold); // Lewandowski
    _addChecklistItem(5, RarityTier.Gold); // De Bruyne
    _addChecklistItem(6, RarityTier.Gold); // Modrić
    _addChecklistItem(7, RarityTier.Gold); // Hazard
    _addChecklistItem(8, RarityTier.Gold); // Ramos
    _addChecklistItem(9, RarityTier.Gold); // Kroos
    _addChecklistItem(10, RarityTier.Gold); // Suárez
    _addChecklistItem(11, RarityTier.Gold); // Kane
    _addChecklistItem(12, RarityTier.Gold); // Agüero
    _addChecklistItem(13, RarityTier.Gold); // Mbappé
    _addChecklistItem(14, RarityTier.Gold); // Higuaín
    _addChecklistItem(15, RarityTier.Gold); // de Gea
    _addChecklistItem(16, RarityTier.Gold); // Griezmann
    _addChecklistItem(17, RarityTier.Gold); // Kanté
    _addChecklistItem(18, RarityTier.Gold); // Cavani
    _addChecklistItem(19, RarityTier.Gold); // Pogba

    /* ORIGINALS - SILVER (020 to 032) */
    _addChecklistItem(20, RarityTier.Silver); // Isco
    _addChecklistItem(21, RarityTier.Silver); // Marcelo
    _addChecklistItem(22, RarityTier.Silver); // Neuer
    _addChecklistItem(23, RarityTier.Silver); // Mertens
    _addChecklistItem(24, RarityTier.Silver); // James
    _addChecklistItem(25, RarityTier.Silver); // Dybala
    _addChecklistItem(26, RarityTier.Silver); // Eriksen
    _addChecklistItem(27, RarityTier.Silver); // David Silva
    _addChecklistItem(28, RarityTier.Silver); // Gabriel Jesus
    _addChecklistItem(29, RarityTier.Silver); // Thiago
    _addChecklistItem(30, RarityTier.Silver); // Courtois
    _addChecklistItem(31, RarityTier.Silver); // Coutinho
    _addChecklistItem(32, RarityTier.Silver); // Iniesta

    // Move to the next deploy step.
    deployStep = DeployStep.WaitingForStepTwo;
  }

  /// @dev Deploys Originals #033 through #065.
  function deployStepTwo() external onlyOwner {
    require(deployStep == DeployStep.WaitingForStepTwo, "You're not following the steps in order...");

    /* ORIGINALS - SILVER (033 to 049) */
    _addChecklistItem(33, RarityTier.Silver); // Casemiro
    _addChecklistItem(34, RarityTier.Silver); // Lukaku
    _addChecklistItem(35, RarityTier.Silver); // Piqué
    _addChecklistItem(36, RarityTier.Silver); // Hummels
    _addChecklistItem(37, RarityTier.Silver); // Godín
    _addChecklistItem(38, RarityTier.Silver); // Özil
    _addChecklistItem(39, RarityTier.Silver); // Son
    _addChecklistItem(40, RarityTier.Silver); // Sterling
    _addChecklistItem(41, RarityTier.Silver); // Lloris
    _addChecklistItem(42, RarityTier.Silver); // Falcao
    _addChecklistItem(43, RarityTier.Silver); // Rakitić
    _addChecklistItem(44, RarityTier.Silver); // Sané
    _addChecklistItem(45, RarityTier.Silver); // Firmino
    _addChecklistItem(46, RarityTier.Silver); // Mané
    _addChecklistItem(47, RarityTier.Silver); // Müller
    _addChecklistItem(48, RarityTier.Silver); // Alli
    _addChecklistItem(49, RarityTier.Silver); // Navas

    /* ORIGINALS - BRONZE (050 to 065) */
    _addChecklistItem(50, RarityTier.Bronze); // Thiago Silva
    _addChecklistItem(51, RarityTier.Bronze); // Varane
    _addChecklistItem(52, RarityTier.Bronze); // Di María
    _addChecklistItem(53, RarityTier.Bronze); // Alba
    _addChecklistItem(54, RarityTier.Bronze); // Benatia
    _addChecklistItem(55, RarityTier.Bronze); // Werner
    _addChecklistItem(56, RarityTier.Bronze); // Sigurðsson
    _addChecklistItem(57, RarityTier.Bronze); // Matić
    _addChecklistItem(58, RarityTier.Bronze); // Koulibaly
    _addChecklistItem(59, RarityTier.Bronze); // Bernardo Silva
    _addChecklistItem(60, RarityTier.Bronze); // Kompany
    _addChecklistItem(61, RarityTier.Bronze); // Moutinho
    _addChecklistItem(62, RarityTier.Bronze); // Alderweireld
    _addChecklistItem(63, RarityTier.Bronze); // Forsberg
    _addChecklistItem(64, RarityTier.Bronze); // Mandžukić
    _addChecklistItem(65, RarityTier.Bronze); // Milinković-Savić

    // Move to the next deploy step.
    deployStep = DeployStep.WaitingForStepThree;
  }

  /// @dev Deploys Originals #066 through #099 and marks set as complete.
  function deployStepThree() external onlyOwner {
    require(deployStep == DeployStep.WaitingForStepThree, "You're not following the steps in order...");

    /* ORIGINALS - BRONZE (066 to 099) */
    _addChecklistItem(66, RarityTier.Bronze); // Kagawa
    _addChecklistItem(67, RarityTier.Bronze); // Xhaka
    _addChecklistItem(68, RarityTier.Bronze); // Christensen
    _addChecklistItem(69, RarityTier.Bronze); // Zieliński
    _addChecklistItem(70, RarityTier.Bronze); // Smolov
    _addChecklistItem(71, RarityTier.Bronze); // Shaqiri
    _addChecklistItem(72, RarityTier.Bronze); // Rashford
    _addChecklistItem(73, RarityTier.Bronze); // Hernández
    _addChecklistItem(74, RarityTier.Bronze); // Lozano
    _addChecklistItem(75, RarityTier.Bronze); // Ziyech
    _addChecklistItem(76, RarityTier.Bronze); // Moses
    _addChecklistItem(77, RarityTier.Bronze); // Farfán
    _addChecklistItem(78, RarityTier.Bronze); // Elneny
    _addChecklistItem(79, RarityTier.Bronze); // Berg
    _addChecklistItem(80, RarityTier.Bronze); // Ochoa
    _addChecklistItem(81, RarityTier.Bronze); // Akinfeev
    _addChecklistItem(82, RarityTier.Bronze); // Azmoun
    _addChecklistItem(83, RarityTier.Bronze); // Cueva
    _addChecklistItem(84, RarityTier.Bronze); // Khazri
    _addChecklistItem(85, RarityTier.Bronze); // Honda
    _addChecklistItem(86, RarityTier.Bronze); // Cahill
    _addChecklistItem(87, RarityTier.Bronze); // Mikel
    _addChecklistItem(88, RarityTier.Bronze); // Sung-yueng
    _addChecklistItem(89, RarityTier.Bronze); // Ruiz
    _addChecklistItem(90, RarityTier.Bronze); // Yoshida
    _addChecklistItem(91, RarityTier.Bronze); // Al Abed
    _addChecklistItem(92, RarityTier.Bronze); // Chung-yong
    _addChecklistItem(93, RarityTier.Bronze); // Gómez
    _addChecklistItem(94, RarityTier.Bronze); // Sliti
    _addChecklistItem(95, RarityTier.Bronze); // Ghoochannejhad
    _addChecklistItem(96, RarityTier.Bronze); // Jedinak
    _addChecklistItem(97, RarityTier.Bronze); // Al-Sahlawi
    _addChecklistItem(98, RarityTier.Bronze); // Gunnarsson
    _addChecklistItem(99, RarityTier.Bronze); // Pérez

    // Mark the end of the Originals set.
    markSetAsComplete();

    // Move to the next deploy step.
    deployStep = DeployStep.WaitingForStepFour;
  }

  function deployStepFour() external onlyOwner {
    require(deployStep == DeployStep.WaitingForStepFour, "You're not following the steps in order...");

    /* ICONICS */
    _addChecklistItem(0, RarityTier.IconicInsert); // Messi
    _addChecklistItem(1, RarityTier.IconicInsert); // Ronaldo
    _addChecklistItem(2, RarityTier.IconicInsert); // Neymar
    _addChecklistItem(3, RarityTier.IconicInsert); // Salah
    _addChecklistItem(4, RarityTier.IconicInsert); // Lewandowski
    _addChecklistItem(5, RarityTier.IconicInsert); // De Bruyne
    _addChecklistItem(6, RarityTier.IconicInsert); // Modrić
    _addChecklistItem(7, RarityTier.IconicInsert); // Hazard
    _addChecklistItem(8, RarityTier.IconicInsert); // Ramos
    _addChecklistItem(9, RarityTier.IconicInsert); // Kroos
    _addChecklistItem(10, RarityTier.IconicInsert); // Suárez
    _addChecklistItem(11, RarityTier.IconicInsert); // Kane
    _addChecklistItem(12, RarityTier.IconicInsert); // Agüero
    _addChecklistItem(15, RarityTier.IconicInsert); // de Gea
    _addChecklistItem(16, RarityTier.IconicInsert); // Griezmann
    _addChecklistItem(17, RarityTier.IconicInsert); // Kanté
    _addChecklistItem(18, RarityTier.IconicInsert); // Cavani
    _addChecklistItem(19, RarityTier.IconicInsert); // Pogba
    _addChecklistItem(21, RarityTier.IconicInsert); // Marcelo
    _addChecklistItem(24, RarityTier.IconicInsert); // James
    _addChecklistItem(26, RarityTier.IconicInsert); // Eriksen
    _addChecklistItem(29, RarityTier.IconicInsert); // Thiago
    _addChecklistItem(36, RarityTier.IconicInsert); // Hummels
    _addChecklistItem(38, RarityTier.IconicInsert); // Özil
    _addChecklistItem(39, RarityTier.IconicInsert); // Son
    _addChecklistItem(46, RarityTier.IconicInsert); // Mané
    _addChecklistItem(48, RarityTier.IconicInsert); // Alli
    _addChecklistItem(49, RarityTier.IconicInsert); // Navas
    _addChecklistItem(73, RarityTier.IconicInsert); // Hernández
    _addChecklistItem(85, RarityTier.IconicInsert); // Honda
    _addChecklistItem(100, RarityTier.IconicReferral); // Alves
    _addChecklistItem(101, RarityTier.IconicReferral); // Zlatan

    // Mark the end of the Iconics set.
    markSetAsComplete();

    // Mark the initial deploy as complete.
    deployStep = DeployStep.DoneInitialDeploy;
  }

  /// @dev Increments the currentSetId, which prevents us from adding any
  ///   more checklist items to the previous value.
  function markSetAsComplete() public onlyOwner {
    currentSetId++;
    // Check for overflow and revert if we've added too many sets. (unlikely)
    assert(currentSetId > 0);
  }
}
